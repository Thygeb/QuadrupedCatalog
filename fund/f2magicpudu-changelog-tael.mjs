#!/usr/bin/env node
import process from 'node:process';
import { laesForbindelse } from '../db/fase2-tjek.mjs';
async function hoved() {
  const gren = process.argv[2];
  if (!gren) { console.error('Brug: node f2magicpudu-changelog-tael.mjs <grennavn>'); return 2; }
  const { url, headers } = laesForbindelse();
  const svar = await fetch(`${url}/rest/v1/change_log?changed_by=eq.${encodeURIComponent(gren)}&select=id`, {
    headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
  });
  const cr = svar.headers.get('content-range');
  const total = cr && cr.includes('/') ? Number(cr.split('/')[1]) : null;
  console.log(`change_log raekker for changed_by=${gren}: ${total}`);
  return 0;
}
hoved().then((k) => { process.exitCode = k; }).catch((e) => { console.error(String(e && e.stack ? e.stack : e)); process.exitCode = 1; });
