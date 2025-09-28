alter table public.community_posts
  drop constraint if exists community_posts_author_id_fkey;
alter table public.community_posts
  add constraint community_posts_author_id_profiles_fkey
    foreign key (author_id) references public.profiles(id) on delete cascade;
create index if not exists community_posts_author_id_idx
  on public.community_posts(author_id);
