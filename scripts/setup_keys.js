const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

async function main() {
  const envPath = path.resolve('.env');
  let env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\n/).forEach(line => {
      const [k,v] = line.split('=');
      if (k) env[k] = v;
    });
  }
  if (!env.OPENAI_API_KEY) env.OPENAI_API_KEY = await prompt('Enter your OpenAI API key (leave blank to skip): ');
  if (!env.VISUAL_API_KEY) env.VISUAL_API_KEY = await prompt('Enter your OpenAI visual API key (leave blank to skip): ');
  if (!env.INWORLD_API_KEY) env.INWORLD_API_KEY = await prompt('Enter your Inworld API key (Base64): ');
  const lines = Object.entries(env).filter(([k,v]) => v).map(([k,v]) => `${k}=${v}`);
  fs.writeFileSync(envPath, lines.join('\n'));
  console.log('Keys saved to .env');
}

if (require.main === module) {
  main();
}
