-- Remove execute privileges from Supabase's built-in SECURITY DEFINER DDL helper.
-- The event trigger itself remains enabled; only direct client invocation is blocked.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;
