const { Client } = require('pg');
require('dotenv').config();

async function fixParticipantConstraints() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Step 1: Drop the incorrect unique constraint on userId alone
    console.log('Dropping incorrect unique constraint on userId...');
    await client.query(`
      ALTER TABLE project_participants 
      DROP CONSTRAINT IF EXISTS project_participants_userId_key;
    `);
    console.log('✓ Dropped incorrect constraint');

    // Step 2: Create the correct composite unique constraint
    console.log('Creating correct composite unique constraint...');
    await client.query(`
      ALTER TABLE project_participants 
      ADD CONSTRAINT project_participants_projectId_userId_unique 
      UNIQUE ("projectId", "userId");
    `);
    console.log('✓ Created composite unique constraint');

    // Step 3: Verify the constraints
    console.log('Verifying constraints...');
    const result = await client.query(`
      SELECT 
        conname as constraint_name,
        contype as constraint_type,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = 'project_participants'::regclass;
    `);

    console.log('\nCurrent constraints on project_participants:');
    result.rows.forEach((row) => {
      console.log(`- ${row.constraint_name}: ${row.constraint_definition}`);
    });

    console.log('\n✅ Database constraints fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing constraints:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the fix
fixParticipantConstraints();
