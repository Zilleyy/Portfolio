/*
 * COPYRIGHT (c) 2021, COOPER COWLEY.
 *
 * THE CONTENT OF THIS FILE WAS WRITTEN BY COOPER COWLEY.
 * THEREFORE, THE CONTENT OF THIS FILE IS THE INTELLECTUAL PROPERTY OF COOPER COWLEY.
 *
 * IF YOU WOULD LIKE TO USE ANY OF MY WORK IN YOUR OWN WORK, YOU MUST GET MY FORMAL PERMISSION BEFOREHAND.
 *
 * CONTACT: https://zilleyy.software/
 */

const { resolve } = require('path');

module.exports = {
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                showcase: resolve(__dirname, 'showcase.html'),
                pricing: resolve(__dirname, 'pricing.html'),
                contact: resolve(__dirname, 'contact.html')
            }
        }
    }
}