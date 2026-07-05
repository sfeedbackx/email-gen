const out = __dirname.concat('/schema.dbml');
try {
  console.log(`DBML schema generated successfully at: ${out}`);
} catch (error) {
  console.error('Failed to generate DBML schema:', error);
  process.exit(1);
}
