import { ApplicationSortBy } from './dto/query-applications.dto';
import { resolveSortColumn } from './applications.service';

/**
 * The sort mapping is the one place a user-supplied value gets near an ORDER
 * BY clause, so it gets a unit test of its own — no database needed.
 */
describe('resolveSortColumn', () => {
  it('maps every enum member to a qualified column', () => {
    expect(resolveSortColumn(ApplicationSortBy.GPA)).toBe('application.gpa');
    expect(resolveSortColumn(ApplicationSortBy.HRS_COMPLETED)).toBe(
      'application.hrsCompleted',
    );
    expect(resolveSortColumn(ApplicationSortBy.LAST_NAME)).toBe('user.lastName');
    expect(resolveSortColumn(ApplicationSortBy.FIRST_NAME)).toBe(
      'user.firstName',
    );
    expect(resolveSortColumn(ApplicationSortBy.APPLIED_AT)).toBe(
      'application.appliedAt',
    );
  });

  it('covers every value of the enum', () => {
    for (const value of Object.values(ApplicationSortBy)) {
      expect(() => resolveSortColumn(value)).not.toThrow();
    }
  });

  it('never returns caller-supplied text', () => {
    // Belt and braces: even if validation were bypassed, the function can only
    // ever return one of its own hardcoded strings.
    const injection = 'gpa; DROP TABLE users--' as ApplicationSortBy;
    expect(() => resolveSortColumn(injection)).toThrow(
      /Unsupported sort field/,
    );
  });
});
