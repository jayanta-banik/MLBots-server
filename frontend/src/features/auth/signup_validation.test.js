import { describe, expect, it } from 'vitest';

import { getPasswordAssessment, validateLastName, validateUsername } from './signup_validation.js';

describe('signup validation helpers', () => {
  it('rejects whitespace in the last name and username', () => {
    expect(validateLastName('Van Halen')).toBe('Last name cannot contain whitespace.');
    expect(validateUsername('user name')).toBe('Username cannot contain whitespace.');
  });

  it('reduces password strength when profile details appear in the password', () => {
    const result = getPasswordAssessment({
      dateOfBirth: '1998-04-15',
      email: 'alex@example.com',
      firstName: 'Alex',
      lastName: 'Stone',
      password: 'Alex1998@A',
      username: 'AlexStone',
    });

    expect(result.meetsPolicy).toBe(true);
    expect(result.penalties).toContain('Contains your first name.');
    expect(result.penalties).toContain('Contains your date of birth or birth year.');
    expect(result.score).toBeLessThan(100);
  });
});
