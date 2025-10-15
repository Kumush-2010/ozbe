const hbs = require('hbs')

hbs.registerHelper('multiply', function(a, b) {
    const numA = parseFloat(a) || 0;
    const numB = parseFloat(b) || 0;
    return (numA * numB).toFixed(2);
})
