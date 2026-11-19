import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAREER_ROLES,
  CERTIFICATIONS,
  EDUCATION,
  EXPERTISE_DOMAINS,
  filterCareerRoles,
  filterExpertiseDomains,
  formatInquiryBrief,
  PROFILE,
  validateInquiryForm,
} from './portfolioData';

test('verified LinkedIn portfolio datasets are complete and non-empty', () => {
  assert.equal(PROFILE.proofMetrics.length, 5);
  assert.equal(EXPERTISE_DOMAINS.length, 4);
  assert.equal(CAREER_ROLES.length, 7);
  assert.equal(EDUCATION.length, 4);
  assert.equal(CERTIFICATIONS.length, 4);

  for (const role of CAREER_ROLES) {
    assert.ok(role.role.length > 0);
    assert.ok(role.organization.length > 0);
    assert.ok(role.period.length > 0);
    assert.ok(role.topologyPattern.length > 0);
    assert.ok(role.topologyCaption.length > 0);
  }
});

test('filterExpertiseDomains filters accurately by domain category', () => {
  assert.equal(filterExpertiseDomains(EXPERTISE_DOMAINS, 'all').length, 4);
  const graphMl = filterExpertiseDomains(EXPERTISE_DOMAINS, 'graph-ml');
  assert.equal(graphMl.length, 1);
  assert.equal(graphMl[0].id, 'graph-neural-networks');
});

test('filterCareerRoles filters accurately across research, industry, and teaching', () => {
  const all = filterCareerRoles(CAREER_ROLES, 'all');
  const research = filterCareerRoles(CAREER_ROLES, 'research');
  const clinicalIndustry = filterCareerRoles(CAREER_ROLES, 'clinical-industry');
  const teaching = filterCareerRoles(CAREER_ROLES, 'teaching-leadership');

  assert.equal(all.length, research.length + clinicalIndustry.length + teaching.length);
  assert.ok(research.some((r) => r.organization.includes('Emory')));
  assert.ok(clinicalIndustry.some((r) => r.organization.includes('Dell')));
  assert.ok(clinicalIndustry.some((r) => r.organization.includes('Shepherd')));
  assert.ok(teaching.some((r) => r.role.includes('Teaching Assistant')));
});

test('validateInquiryForm rejects empty or malformed fields without silent fallbacks', () => {
  const errors = validateInquiryForm({
    name: 'A',
    email: 'invalid-email',
    topic: '',
    message: 'Too short',
  });

  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.ok(errors.topic);
  assert.ok(errors.message);
});

test('validateInquiryForm accepts valid inquiry and formatInquiryBrief composes clean message', () => {
  const valid = {
    name: 'Dr. Jordan Patel',
    email: 'jordan.patel@university.edu',
    topic: 'Graph Neural Networks Collaboration',
    message: 'Interested in discussing your community-aware graph sparsification work.',
  };

  const errors = validateInquiryForm(valid);
  assert.deepEqual(errors, {});

  const brief = formatInquiryBrief(valid);
  assert.match(brief, /Shakiba Mashini/);
  assert.match(brief, /Dr\. Jordan Patel/);
  assert.match(brief, /Graph Neural Networks Collaboration/);
});
