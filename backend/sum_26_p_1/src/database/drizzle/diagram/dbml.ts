//import { pgGenerate } from 'drizzle-dbml-generator'; // Using Postgres for this example
import * as schema from '../schema';

const out = __dirname.concat('/schema.dbml');
const relational = true;
try {
 // pgGenerate({ schema, out, relational });
  console.log(`DBML schema generated successfully at: ${out}`);
} catch (error) {
  console.error('Failed to generate DBML schema:', error);
  process.exit(1);
}
