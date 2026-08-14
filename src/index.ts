import { App } from './app.ts';
import { env } from './utils/misc.ts';

async function main() {
  const app = App();
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});