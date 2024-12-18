const OPERATION_STATUSES = {
    FAILED: 'FAILED',
    'NOT-STARTED': 'NOT-STARTED',
    'IN-PROGRESS': 'IN-PROGRESS',
    COMPLETED: 'COMPLETED',
    'NOT-READY': 'NOT-READY'
};

function parseEnvArray(envVariable) {
    if (!envVariable) return [];
    return envVariable
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^'|'$/g, ''));
}

module.exports = {
    OPERATION_STATUSES,
    parseEnvArray
};
