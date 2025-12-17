import { useState, useEffect } from 'react'
import styles from './style/App.module.scss'
import { Providers } from './providers'
import { Router } from './layout/router'
import { supabase, type FrontendWorkflow, mapDbWorkflowToFrontend } from './lib/supabase'


function App() {
	const [workflows, setWorkflows] = useState<FrontendWorkflow[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// Appel direct à Supabase
		const fetchWorkflows = async () => {
			try {
				const { data, error: supabaseError, count } = await supabase
					.from('workflows')
					.select('*', { count: 'exact' })
					.order('created_at', { ascending: false });

				if (supabaseError) {
					throw new Error(supabaseError.message);
				}

				const mappedWorkflows = (data || []).map(mapDbWorkflowToFrontend);
				console.log('✅ Workflows récupérés:', { success: true, data: mappedWorkflows, count });
				setWorkflows(mappedWorkflows);
				setLoading(false);
			} catch (err) {
				console.error('❌ Erreur lors du fetch:', err);
				setError(err instanceof Error ? err.message : 'Erreur inconnue');
				setLoading(false);
			}
		};

		fetchWorkflows();
	}, [])


	if (loading) {
		return (
			<div className={styles.app}>
				<h1>Chargement des workflows...</h1>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.app}>
				<h1>Erreur</h1>
				<p>{error}</p>
				<p>Verifie ta connexion Supabase</p>
			</div>
		)
	}

	console.log({ workflows });

	return <Providers>
		<Router />
	</Providers>;
}

export default App
