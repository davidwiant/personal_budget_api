const express = require('express');
const app = express();

module.exports = app;

//body parsing middleware
app.use(express.json());

//get id from request param
app.param('category', (req, res, next, category) => {
    const envelope = envelopes.find(envelope => envelope.category == category);

    if(envelope) {
        req.envelope = envelope;
        next();
    } else {
        res.status(404).send({error: 'No envelopes found for this category'});    }
});

const PORT = process.env.port || 3000;

const envelopes = [];
let totalBudget = 0;

app.post('/envelopes', (req, res, next) => {
    const newEnvelope = req.body;
    newEnvelope.amount = parseFloat(newEnvelope.amount);
    envelopes.push(newEnvelope);
    totalBudget += newEnvelope.amount;
    res.status(200).send({totalBudget: totalBudget, newEnvelope: newEnvelope});
});
app.get('/envelopes', (req, res, next) => {
    res.send(envelopes);
});

app.get('/envelopes/:category', (req, res, next) => {
    res.send(req.envelope);
});

app.patch('/envelopes/:category', (req, res, next) => {
    const updates = req.body;
    const { envelope } = req;

    //update fields in the envelope
    for(let key in updates) {
        if(key in envelope) {
            //if the key is amount, update the totalBudget
            if(key == 'amount') {
                totalBudget = totalBudget - envelope.amount + parseFloat(updates.amount);
            };
            envelope[key] = updates[key];
        };
    }
    res.send(envelope);
});

app.delete('/envelopes/:category', (req, res, next) => {
    const index = envelopes.findIndex(envelope => envelope.category == req.envelope.category);
    if(index > -1) {
        totalBudget -= envelopes[index].amount;
        envelopes.splice(index, 1);
    }
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
