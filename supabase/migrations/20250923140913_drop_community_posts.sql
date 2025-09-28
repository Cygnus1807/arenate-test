drop policy if exists "Community posts readable" on public.community_posts;
drop policy if exists "Community posts insert own" on public.community_posts;
drop policy if exists "Community posts update own" on public.community_posts;
drop policy if exists "Community posts delete own" on public.community_posts;
drop trigger if exists set_timestamp_on_community_posts on public.community_posts;
drop function if exists public.set_timestamp_on_community_posts();
drop index if exists community_posts_event_id_idx;
drop index if exists community_posts_author_id_idx;
drop table if exists public.community_posts;
