import { useState, useEffect } from 'react'
import styles from './style/App.module.scss'
import { Providers } from './providers'
import { Router } from './layout/router'


interface Workflow {
	_id: string
	title: string
	description?: string
	isEnabled: boolean
	workflowXML: string
	createdAt: string
	updatedAt: string
}

function App() {
	const [workflows, setWorkflows] = useState<Workflow[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// Appel à l'API backend via le proxy
		fetch('/api/workflows')
			.then(res => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`)
				}
				return res.json()
			})
			.then(data => {
				console.log('✅ Workflows récupérés:', data)
				setWorkflows(data.data || [])
				setLoading(false)
			})
			.catch(err => {
				console.error('❌ Erreur lors du fetch:', err)
				setError(err.message)
				setLoading(false)
			})
	}, [])


	if (loading) {
		return (
			<div className={styles.app}>
				<h1>⏳ Chargement des workflows...</h1>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.app}>
				<h1>❌ Erreur</h1>
				<p>{error}</p>
				<p>Assure-toi que le backend est démarré sur http://localhost:3000</p>
			</div>
		)
	}

	console.log({ workflows });

	return <Providers>
		<Router />
	</Providers>;
}

export default App
