'use strict'

function google(req, res, next) {

    // var User = new User();
    // User.name = 'sergio';
    // User.description = 'el mejon de tos';

    // User.save((err, objStored) => {
    //     if (err) res.status(500).send('error en la db al crear el Usuario');
    //     else {
    //         if (!objStored) res.status(500).send('no se ha creado el Usuario');
    //         else {
    //             res.render('form', { title: 'ja je jei jo ju' });
    //         }
    //     }
    // })
    res.send('Esta es la de google, ya veremos luego')
}

module.exports = {
    google
}