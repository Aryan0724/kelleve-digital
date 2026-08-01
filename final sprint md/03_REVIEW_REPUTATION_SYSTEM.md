# REVIEW, RATING & REPUTATION SYSTEM SPECIFICATION

> **Document Version:** 1.0
> **Priority:** Critical
> **Status:** Final Specification
> **Purpose:** This document defines the complete review ecosystem for Find My Interior. Reviews must become one of the strongest trust signals on the platform and should directly influence search rankings, trust score, profile strength, recommendations, and hiring decisions.

---

# 1. Objective

Reviews are the backbone of trust.

A professional should build their reputation through genuine completed work.

Customers should confidently hire professionals based on verified experiences rather than advertisements.

Every review on the platform must originate from an actual completed project.

There will be **NO fake reviews, imported reviews, or manually added ratings.**

---

# 2. Core Principles

A review can only exist if:

- Project was awarded
- Project reached Completed status
- Customer approved completion
- Customer leaves review

No other workflow can generate a review.

---

# 3. Review Lifecycle

```
Project Completed

↓

Review Window Opens

↓

Customer Leaves Review

↓

Professional Leaves Customer Review

↓

Review Published

↓

Trust Score Updated

↓

Profile Updated

↓

Search Ranking Updated

↓

Recommendation Engine Updated
```

---

# 4. Review Window

Reviews become available only after

```
Project Status = Completed
```

Review window remains open for

30 Days

If no review is submitted

Project closes automatically.

---

# 5. Mutual Reviews

Both parties can review each other.

Customer reviews Professional.

Professional reviews Customer.

These are completely independent.

---

# 6. Customer Review Structure

Customer provides

Overall Rating

1-5 Stars

---

Category Ratings

Quality of Work

Communication

Professionalism

Timeliness

Value for Money

Problem Solving

Cleanliness

Would Hire Again

---

Written Review

Minimum

30 Characters

Maximum

2000 Characters

---

Media

Images

Videos

Before/After

Optional

---

# 7. Professional Review Structure

Professional reviews customer.

Categories

Communication

Payment Timeliness

Requirement Clarity

Behaviour

Would Work Again

Overall Rating

Written Feedback

---

# 8. Verified Review Badge

Every review generated from a completed project automatically receives

```
Verified Project
```

Badge.

Users immediately know the review is authentic.

---

# 9. Anonymous Reviews

Not allowed.

Reviewer identity always exists internally.

Frontend may optionally hide full name.

---

# 10. Review Editing

Customer can edit review

Within

7 Days

After that

Locked permanently.

---

# 11. Review Deletion

Customer cannot delete.

Professional cannot delete.

Only Admin can remove reviews for

Spam

Fraud

Abuse

Legal issues

---

# 12. Review Moderation

Admin panel should support

Approve

Hide

Delete

Restore

Flag

Review History

Reason Logs

---

# 13. Review Impact

Each new review updates

Average Rating

Review Count

Trust Score

Recommendation Ranking

Search Ranking

Vendor Statistics

Response Metrics

Everything updates automatically.

No cached hardcoded values.

---

# 14. Rating Calculation

Overall Rating is NOT manually entered.

Calculated as weighted average.

Example

Quality

20%

Communication

15%

Professionalism

20%

Timeliness

15%

Value

15%

Problem Solving

10%

Cleanliness

5%

Final Rating

Automatically calculated.

---

# 15. Profile Statistics

Professional profile automatically displays

Average Rating

Review Count

5 Star Reviews

4 Star Reviews

3 Star Reviews

2 Star Reviews

1 Star Reviews

Response Rate

Repeat Clients

Projects Completed

Recommendation Percentage

---

# 16. Review Timeline

Professional profile should show

Latest Reviews

Highest Rated Reviews

Lowest Rated Reviews

Most Helpful Reviews

Project Type

Project Budget

Completion Date

Reviewer Verification

---

# 17. Helpful Reviews

Users can mark

Helpful

Not Helpful

Reviews are ranked using

Helpfulness

Recency

Rating Quality

Project Size

---

# 18. Fake Review Protection

System must reject reviews if

Project not completed

Reviewer not part of project

Duplicate review

Already reviewed

Project cancelled

Project disputed

---

# 19. Review Replies

Professional can reply

Exactly once.

Customer cannot reply again.

Creates structured conversation.

---

# 20. Reputation Score

Separate from Trust Score.

Reputation Score measures

Customer Satisfaction

Components

Average Rating

40%

Review Volume

20%

Repeat Customers

15%

Response Rate

10%

Complaint Rate

-10%

Dispute Rate

-5%

---

# 21. Review Influence on Search

Search ranking factors

Trust Score

Verification

Reputation Score

Average Rating

Review Count

Completed Projects

Response Rate

Subscription

Featured Status

Location Match

---

# 22. Recommendation Engine

Professionals with

High Rating

High Review Count

High Completion Rate

High Trust

should receive

Higher recommendation priority.

---

# 23. Customer Confidence Indicators

Professional profile should answer

How many people hired them?

What did customers think?

Would customers hire again?

How many repeat clients?

Any disputes?

Average project size?

Response speed?

Project completion percentage?

---

# 24. Admin Dashboard Features

Admin should manage

Review Queue

Flagged Reviews

Reported Reviews

Hidden Reviews

Deleted Reviews

Appealed Reviews

Review Analytics

Rating Distribution

Most Reported Vendors

Fake Review Detection

---

# 25. Review Notifications

Customer receives

Review Reminder

Review Published

Professional Replied

---

Professional receives

New Review

Rating Updated

Reply Reminder

Review Reported

---

Admin receives

Reported Review

Spam Detection

Legal Complaint

---

# 26. Database Requirements

Every review stores

Project ID

Customer ID

Professional ID

Overall Rating

Category Ratings

Review Text

Images

Videos

Reply

Helpful Count

Report Count

Verification Status

Created Date

Updated Date

Moderation Status

---

# 27. Fix Existing Problems

The following issues MUST be fixed.

✅ Reviews should immediately update the professional profile.

✅ Review count should never remain zero after review submission.

✅ Average rating must recalculate automatically.

✅ Vendor statistics must update automatically.

✅ Trust Score must update automatically.

✅ Reputation Score must update automatically.

✅ Homepage "Top Professionals" must reflect the new rating.

✅ Search rankings must update.

No hardcoded review counts.

No cached fake values.

Everything must come directly from database.

---

# 28. Non-Negotiable Rules

- No review without completed project.
- No fake reviews.
- No duplicate reviews.
- No manual rating manipulation.
- Every review affects reputation.
- Every review affects search.
- Every review affects recommendations.
- Every review affects profile statistics.
- Every review must persist permanently unless moderated by Admin.
- Reviews are one of the strongest trust signals on the platform.