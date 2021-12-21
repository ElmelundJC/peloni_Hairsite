// Basicly et script der gør at vi pakker vores funktioner ind i denne catchAsync funktion og dermed ikke skal putte vores funktioner ind i try/catch blokke. Det gør også yderligere at vi kan handle vores errors som vist i "ErrorController".

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}