-- Migration to update OpportunityStage enum values
-- First, update existing data to map old enum values to new ones

-- Map old enum values to new ones:
-- NEW -> IDEAS_CONTACT_PROJECT
-- QUALIFIED -> FOLLOW_UP_EMAILS  
-- PROPOSAL -> PROPOSAL_TO_DO
-- NEGOTIATION -> IN_DISCUSSION
-- WON -> CLOSED_WON
-- LOST -> CLOSED_LOST

-- Update opportunities with old enum values
UPDATE "Opportunity" SET stage = 'IDEAS_CONTACT_PROJECT' WHERE stage = 'NEW';
UPDATE "Opportunity" SET stage = 'FOLLOW_UP_EMAILS' WHERE stage = 'QUALIFIED';
UPDATE "Opportunity" SET stage = 'PROPOSAL_TO_DO' WHERE stage = 'PROPOSAL';
UPDATE "Opportunity" SET stage = 'IN_DISCUSSION' WHERE stage = 'NEGOTIATION';
UPDATE "Opportunity" SET stage = 'CLOSED_WON' WHERE stage = 'WON';
UPDATE "Opportunity" SET stage = 'CLOSED_LOST' WHERE stage = 'LOST';

-- Now alter the enum type
-- First, create a new enum with the new values
CREATE TYPE "OpportunityStage_new" AS ENUM (
  'IDEAS_CONTACT_PROJECT',
  'FOLLOW_UP_EMAILS',
  'MEETING_BOOKED',
  'IN_DISCUSSION',
  'PROPOSAL_TO_DO',
  'PROPOSAL_SENT',
  'CONTRACT_TO_DO',
  'CLOSED_WON',
  'CLOSED_LOST',
  'RENEWALS_POTENTIAL_UPCOMING',
  'WAITING_OR_SILENT'
);

-- Alter the column to use the new enum
ALTER TABLE "Opportunity" 
  ALTER COLUMN stage TYPE "OpportunityStage_new" 
  USING stage::text::"OpportunityStage_new";

-- Drop the old enum and rename the new one
DROP TYPE "OpportunityStage";
ALTER TYPE "OpportunityStage_new" RENAME TO "OpportunityStage";


