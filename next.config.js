/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: [
			// NextJS <Image> component needs to whitelist domains for src={}
			"lh3.googleusercontent.com",
			"pbs.twimg.com",
			"images.unsplash.com",
			"logos-world.net",
			"workspace.nbg1.your-objectstorage.com",
		],
	},
	reactStrictMode: false,
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.watchOptions = {
				ignored: [/node_modules/, /\.next/],
			};
		}
		return config;
	},
};

module.exports = nextConfig;
