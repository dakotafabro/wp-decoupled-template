import { gql, setOutgoingHeaders } from '@pantheon-systems/wordpress-kit';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';

import { getFooterMenu } from '../../lib/Menus';
import { client } from '../../lib/WordPressClient';
import styles from './auth-api.module.css';

export default function AuthApiExampleTemplate({ menuItems, privatePosts }) {
	return (
		<Layout footerMenu={menuItems}>
			<Head>
				<title>API Authorization Example</title>
				<meta title="" description="" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles.container}>
				<h1>API Authorization Example</h1>

				<Link passHref href="/">
					<span>Home &rarr;</span>
				</Link>

				<div>
					{privatePosts?.length > 0 ? (
						<p>
							🎉 Next.js was able to successfully make an authenticated request
							to WordPress! 🎉
						</p>
					) : (
						<>
							<p>
								Next.js was unable to make an authorized request to the
								WordPress API. Please check your .env.development.local file to
								ensure that your <code>WP_APPLICATION_USERNAME</code> and{' '}
								<code>WP_APPLICATION_PASSWORD</code> are set correctly.
							</p>
							<p>
								For more information on how to set these values, please see{' '}
								<a href="https://decoupledkit.pantheon.io/docs/frontend-starters/nextjs/nextjs-wordpress/setting-environment-variables">
									Setting Environment Variables
								</a>
							</p>
						</>
					)}
				</div>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ res }) {
	const credentials = `${process.env.WP_APPLICATION_USERNAME}:${process.env.WP_APPLICATION_PASSWORD}`;
	const encodedCredentials = Buffer.from(credentials, 'binary').toString(
		'base64',
	);
	client.setHeader('Authorization', `Basic ${encodedCredentials}`);
	const query = gql`
		query LatestPostsQuery {
			posts(where: { status: PRIVATE }) {
				edges {
					node {
						id
					}
				}
			}
		}
	`;

	const {
		data: {
			posts: { edges },
		},
		headers: postHeaders,
	} = await client.rawRequest(query);

	const { menuItems, menuItemHeaders } = await getFooterMenu();
	const privatePosts = edges.map(({ node }) => node);

	const headers = postHeaders && [menuItemHeaders, postHeaders];
	setOutgoingHeaders({ headers, res });

	return {
		props: {
			menuItems,
			privatePosts,
		},
	};
}
