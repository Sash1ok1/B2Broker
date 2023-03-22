function buildMessage (type, data = {}) {
    const { status = null, count = null, error = null } = data
    const response = {
        type,
        updatedAt: new Date()
    }
    if (status) {
        response.status = status
    }
    if (count) {
        response.count = count
    }
    if (error) {
        response.error = error
    }

    return JSON.stringify(response);
}

module.exports = { buildMessage }
