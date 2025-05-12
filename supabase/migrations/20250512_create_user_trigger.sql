
-- Create a trigger function to automatically create user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, pulse_id)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'pulse_id'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = COALESCE(new.raw_user_meta_data->>'full_name', users.name),
    pulse_id = COALESCE(new.raw_user_meta_data->>'pulse_id', users.pulse_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
