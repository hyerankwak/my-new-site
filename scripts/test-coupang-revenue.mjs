import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, kstDay, dateOffset, signatureHeader } from './coupang-revenue.mjs';

const article = { subId: 'article1', title: 'Test article', url: 'https://toypoppo.kr/blog/test.html', activatedAt: '2026-10-30T01:00:00Z' };
const fixture = () => ({ fetchedAt: '2026-11-02T07:00:00Z', startDate: '20261003', endDate: '20261101', reports: {
  clicks: { ok: true, rows: [] }, orders: { ok: true, rows: [] }, cancels: { ok: true, rows: [] },
  commission: { ok: true, rows: [
    { date: '20261029', subId: 'article1', commission: 50 },
    { date: '20261030', subId: 'article1', commission: 90, order: 2, cancel: 1, click: 3 },
    { date: '20261101', subId: '', commission: 120, order: 1 },
    { date: '20261101', subId: 'another-site', commission: 300 },
  ] },
} });
test('KST boundaries and month rollover', () => {
  assert.equal(kstDay(new Date('2026-11-01T15:01:00Z')), '20261102');
  assert.equal(dateOffset('20261101', -1), '20261031');
});
test('income uses commission report once; no product-based or preactivation attribution', () => {
  const cache = fixture(); cache.reports.orders.rows.push({ commission: 999999, productId: 123 });
  const s = summarize(cache, 7, [article], []);
  assert.equal(s.totals.commission, 560);
  assert.equal(s.articleCommission, 90);
  assert.equal(s.otherOrUnattributedCommission, 470);
  assert.equal(s.articles[0].orders, 2);
});
test('new tracking is awaiting report, not zero revenue', () => {
  const s = summarize(fixture(), 7, [{ ...article, activatedAt: '2026-11-02T07:00:00Z' }], []);
  assert.equal(s.articles[0].status, 'awaiting-report');
  assert.equal(s.articles[0].commission, null);
});
test('failed report is unavailable rather than zero', () => {
  const cache = fixture(); cache.reports.commission = { ok: false, rows: [] };
  const s = summarize(cache, 7, [article], []);
  assert.equal(s.totals, null); assert.equal(s.articleCommission, null);
  assert.equal(s.articles[0].status, 'unavailable');
});
test('invalid period is rejected and HMAC includes method/path/query', () => {
  assert.throws(() => summarize(fixture(), 999, [], []));
  const key = { COUPANG_ACCESS_KEY: 'test', COUPANG_SECRET_KEY: 'secret' };
  assert.notEqual(signatureHeader('GET', '/reports', 'start=1', key, 'date'), signatureHeader('GET', '/reports', 'start=2', key, 'date'));
});
