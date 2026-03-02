import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://bnvkvgdznvrvcqpnuzvg.supabase.co",
  "sb_publishable_uzHZR1s9T6f-i7yJKEmg0g_QD2MCg-E"
);

export default async function handler(req, res) {
  const { id } = req.query;

  // Ambil data langsung dari Supabase
  const { data, error } = await supabase
    .from('scripts')
    .select('content')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res.status(404).send('-- Script Not Found');
  }

  // DETEKSI: Jika diakses browser (bukan executor)
  const ua = req.headers['user-agent'] || '';
  const isBrowser = ua.includes('Mozilla') && !ua.includes('Roblox');

  if (isBrowser) {
    // Redirect balik ke halaman Access Denied di frontend
    return res.redirect(`/raw/${id}`);
  }

  // JIKA EXECUTOR: Kirim teks murni (Plain Text)
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.send(data.content);
}
