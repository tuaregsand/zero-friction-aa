// eslint-env node
/* global process */
import { withBundleAnalyzer } from 'next-bundle-analyzer';

const plugin = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

export default plugin({});
