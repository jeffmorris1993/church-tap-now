CREATE OR REPLACE FUNCTION public.validate_visitor()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(NEW.name) < 1 OR length(NEW.name) > 120 THEN
    RAISE EXCEPTION 'Invalid name length';
  END IF;
  IF length(NEW.email) > 255 OR NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF NEW.phone IS NOT NULL AND length(NEW.phone) > 40 THEN
    RAISE EXCEPTION 'Invalid phone length';
  END IF;
  IF array_length(NEW.interests, 1) > 20 THEN
    RAISE EXCEPTION 'Too many interests';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_visitor_trigger
  BEFORE INSERT OR UPDATE ON public.visitors
  FOR EACH ROW EXECUTE FUNCTION public.validate_visitor();