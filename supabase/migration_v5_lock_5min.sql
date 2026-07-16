-- Migration v5: Change lock duration from 15 to 5 minutes
CREATE OR REPLACE FUNCTION public.increment_failed_attempts(target_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record public.users%ROWTYPE;
  max_attempts CONSTANT INT := 5;
  lock_minutes CONSTANT INT := 5;
  new_attempts INT;
  new_locked_until TIMESTAMPTZ;
BEGIN
  SELECT * INTO user_record FROM public.users WHERE id = target_user_id;
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'user_not_found');
  END IF;

  IF user_record.locked_until IS NOT NULL AND user_record.locked_until > now() THEN
    RETURN json_build_object('locked', true, 'failed_attempts', user_record.failed_attempts, 'locked_until', user_record.locked_until);
  END IF;

  IF user_record.locked_until IS NOT NULL AND user_record.locked_until <= now() THEN
    UPDATE public.users SET failed_attempts = 0, locked_until = NULL WHERE id = target_user_id;
    user_record.failed_attempts := 0;
  END IF;

  new_attempts := user_record.failed_attempts + 1;

  IF new_attempts >= max_attempts THEN
    new_locked_until := now() + (lock_minutes || ' minutes')::INTERVAL;
    UPDATE public.users SET failed_attempts = new_attempts, locked_until = new_locked_until WHERE id = target_user_id;
    RETURN json_build_object('locked', true, 'failed_attempts', new_attempts, 'locked_until', new_locked_until);
  ELSE
    UPDATE public.users SET failed_attempts = new_attempts WHERE id = target_user_id;
    RETURN json_build_object('locked', false, 'failed_attempts', new_attempts);
  END IF;
END;
$$;
