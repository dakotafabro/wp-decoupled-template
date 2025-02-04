import { Paginator } from '@pantheon-systems/nextjs-kit';
import { setOutgoingHeaders } from '@pantheon-systems/wordpress-kit';
import { NextSeo } from 'next-seo';
import Layout from '../../../components/layout';
import { getFooterMenu } from '../../../lib/Menus';
import { paginationPostsQuery } from '../../../lib/PostsPagination';

import styles from './pagination.module.css';

export default function PaginationExampleTemplate({ menuItems, posts }) {
	const RenderCurrentItems = ({ currentItems }) => {
		return currentItems.map((item) => {
			return (
				<article key={item.title} className={styles.item}>
					<h2>{item.title}</h2>
					<div dangerouslySetInnerHTML={{ __html: item.excerpt }} />
				</article>
			);
		});
	};
	return (
		<Layout footerMenu={menuItems}>
			<NextSeo>
				<title>Pagination example</title>
				<meta title="" description="" />
				<link rel="icon" href="/favicon.ico" />
			</NextSeo>
			<div className={styles.container}>
				<section className={styles.content}>
					{posts ? (
						<>
							<h1>Pagination example</h1>
							<Paginator
								data={posts}
								itemsPerPage={5}
								breakpoints={{ start: 4, end: 8, add: 4 }}
								routing
								Component={RenderCurrentItems}
							/>
						</>
					) : (
						<p className={styles.noData}>
							This example relies on data from{' '}
							<code>https://dev-decoupled-wp-mock-data.pantheonsite.io</code>.
							If you&apos;re seeing this message, it may be unreachable. Try
							building again when it is reachable or create your own data with
							the{' '}
							<a
								className={styles.link}
								href="https://wordpress.org/plugins/fakerpress/"
								rel="noopener"
							>
								FakerPress Plugin
							</a>
							.
						</p>
					)}
				</section>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ res }) {
	let footerMenuResults, paginationResults;
	try {
		footerMenuResults = await getFooterMenu();
		paginationResults = await paginationPostsQuery();
	} catch (error) {
		console.error(error.message);
		!paginationResults?.posts &&
			console.error('Returning null for pagination example data...');
	} finally {
		const headers = [];
		footerMenuResults?.menuItemHeaders &&
			headers.push(footerMenuResults.menuItemHeaders);
		paginationResults?.headers && headers.push(paginationResults.headers);
		setOutgoingHeaders({ headers, res });
		return {
			props: {
				menuItems: footerMenuResults?.menuItems || [],
				posts: paginationResults?.posts || null,
			},
		};
	}
}
