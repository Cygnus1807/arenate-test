-- Additional sample events/announcements for local development
insert into public.events (name, organizer, category, date, img, details)
values
  (
    'Melody Fest',
    'Music Society',
    'Cultural',
    '2025-10-20T18:00:00+05:30',
    'https://placehold.co/600x400/fed7aa/7c2d12?text=Melody+Fest',
    '{}'::jsonb
  ),
  (
    'Startup Pitch Day',
    'E-Cell',
    'Business',
    '2025-10-22T14:00:00+05:30',
    'https://placehold.co/600x400/bae6fd/0c4a6e?text=Pitch+Day',
    '{}'::jsonb
  )
on conflict do nothing;

insert into public.announcements (type, title, content)
values
  ('New', 'New Event Added: ''Designathon''', 'A new UI/UX design competition is now open for registration!'),
  ('Deadline', 'Melody Fest Registration Closes Soon', 'Last day to register is Oct 18. Don''t miss out!')
on conflict do nothing;
