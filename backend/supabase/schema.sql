-- ============================================================================
-- Schema SQL PostgreSQL pour Supabase
-- Migration depuis MongoDB/Mongoose
-- ============================================================================

-- Extension pour UUID (généralement déjà activée sur Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- FONCTION TRIGGER pour updated_at automatique
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLE: workflows
-- Source Mongoose: Workflow
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Champs métier
    title VARCHAR(255) NOT NULL,
    description TEXT,
    fragment_id VARCHAR(255) DEFAULT 'DEFAULT',
    is_enabled SMALLINT DEFAULT 1 CHECK (is_enabled IN (0, 1)),
    workflow_text TEXT NOT NULL,  -- Contenu XML du workflow
    preferences JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour workflows
CREATE INDEX IF NOT EXISTS idx_workflows_fragment_id ON workflows(fragment_id);
CREATE INDEX IF NOT EXISTS idx_workflows_is_enabled ON workflows(is_enabled);
CREATE INDEX IF NOT EXISTS idx_workflows_created_at ON workflows(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER trigger_workflows_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Policy permissive (à restreindre selon vos besoins d'authentification)
CREATE POLICY "Allow all operations on workflows" ON workflows
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- TABLE: executions
-- Source Mongoose: Execution
-- ============================================================================

CREATE TABLE IF NOT EXISTS executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Référence au workflow
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,

    -- Champs métier
    current_workflow_item_id VARCHAR(255) NOT NULL,
    current_loop_turn INTEGER,  -- nullable
    workflow_resume JSONB DEFAULT '[]'::jsonb,
    workflow_switch_values JSONB DEFAULT '[]'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour executions
CREATE INDEX IF NOT EXISTS idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_executions_workflow_created ON executions(workflow_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_executions_created_at ON executions(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER trigger_executions_updated_at
    BEFORE UPDATE ON executions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;

-- Policy permissive
CREATE POLICY "Allow all operations on executions" ON executions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- TABLE: steps
-- Source Mongoose: Step
-- ============================================================================

CREATE TABLE IF NOT EXISTS steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Référence à l'exécution
    execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,

    -- Champs métier
    workflow_item_id VARCHAR(255) NOT NULL,
    key_datas JSONB DEFAULT '{}'::jsonb,
    loop_turn INTEGER,  -- nullable

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour steps
CREATE INDEX IF NOT EXISTS idx_steps_execution_id ON steps(execution_id);
CREATE INDEX IF NOT EXISTS idx_steps_execution_created ON steps(execution_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_steps_workflow_item_id ON steps(workflow_item_id);
CREATE INDEX IF NOT EXISTS idx_steps_created_at ON steps(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER trigger_steps_updated_at
    BEFORE UPDATE ON steps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

-- Policy permissive
CREATE POLICY "Allow all operations on steps" ON steps
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- TABLE: views
-- Source Mongoose: View
-- ============================================================================

CREATE TABLE IF NOT EXISTS views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Champs métier (clés composites uniques)
    workflow_id VARCHAR(255) NOT NULL,
    step_id VARCHAR(255) NOT NULL,
    components JSONB DEFAULT '[]'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Contrainte unique sur workflow_id + step_id
    CONSTRAINT uq_views_workflow_step UNIQUE (workflow_id, step_id)
);

-- Index pour views
CREATE INDEX IF NOT EXISTS idx_views_workflow_id ON views(workflow_id);
CREATE INDEX IF NOT EXISTS idx_views_step_id ON views(step_id);
CREATE INDEX IF NOT EXISTS idx_views_created_at ON views(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER trigger_views_updated_at
    BEFORE UPDATE ON views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE views ENABLE ROW LEVEL SECURITY;

-- Policy permissive
CREATE POLICY "Allow all operations on views" ON views
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- TABLE: messages
-- Source Mongoose: Message
-- ============================================================================

-- Types ENUM pour les messages
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE message_status AS ENUM ('pending', 'streaming', 'completed', 'error');

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Champs métier
    workflow_id VARCHAR(255) NOT NULL,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    status message_status DEFAULT 'completed',
    workflow_data JSONB,  -- nullable
    error_message TEXT,   -- nullable
    tokens_used INTEGER,  -- nullable

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour messages
CREATE INDEX IF NOT EXISTS idx_messages_workflow_id ON messages(workflow_id);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_workflow_created ON messages(workflow_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER trigger_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy permissive
CREATE POLICY "Allow all operations on messages" ON messages
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- COMMENTAIRES SUR LES TABLES (documentation)
-- ============================================================================

COMMENT ON TABLE workflows IS 'Définitions des workflows avec leur configuration XML et préférences';
COMMENT ON COLUMN workflows.workflow_text IS 'Contenu XML définissant la structure du workflow';
COMMENT ON COLUMN workflows.preferences IS 'Préférences JSON du workflow';
COMMENT ON COLUMN workflows.is_enabled IS 'Statut actif (1) ou inactif (0)';

COMMENT ON TABLE executions IS 'Instances d''exécution des workflows';
COMMENT ON COLUMN executions.current_workflow_item_id IS 'ID de l''élément courant dans le workflow';
COMMENT ON COLUMN executions.workflow_resume IS 'État de reprise du workflow en JSON';
COMMENT ON COLUMN executions.workflow_switch_values IS 'Valeurs des conditions switch en JSON';

COMMENT ON TABLE steps IS 'Étapes individuelles dans une exécution de workflow';
COMMENT ON COLUMN steps.key_datas IS 'Données clés de l''étape en JSON';
COMMENT ON COLUMN steps.loop_turn IS 'Numéro d''itération si dans une boucle';

COMMENT ON TABLE views IS 'Vues associées aux étapes de workflow avec leurs composants UI';
COMMENT ON COLUMN views.components IS 'Liste des composants UI en JSON';

COMMENT ON TABLE messages IS 'Messages échangés dans le contexte d''un workflow (chat, logs, etc.)';
COMMENT ON COLUMN messages.workflow_data IS 'Données additionnelles du workflow en JSON';
COMMENT ON COLUMN messages.tokens_used IS 'Nombre de tokens utilisés (pour les appels LLM)';

-- ============================================================================
-- FONCTIONS UTILITAIRES (optionnel)
-- ============================================================================

-- Fonction pour obtenir les dernières exécutions d'un workflow
CREATE OR REPLACE FUNCTION get_workflow_executions(p_workflow_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS SETOF executions AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM executions
    WHERE workflow_id = p_workflow_id
    ORDER BY created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour obtenir les steps d'une exécution
CREATE OR REPLACE FUNCTION get_execution_steps(p_execution_id UUID)
RETURNS SETOF steps AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM steps
    WHERE execution_id = p_execution_id
    ORDER BY created_at ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour obtenir les messages d'un workflow
CREATE OR REPLACE FUNCTION get_workflow_messages(p_workflow_id VARCHAR, p_limit INTEGER DEFAULT 50)
RETURNS SETOF messages AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM messages
    WHERE workflow_id = p_workflow_id
    ORDER BY created_at ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- FIN DU SCHEMA
-- ============================================================================
