const express = require('express')
const pool = require('../db/elephant-sql')
const router = new express.Router()

const {
    queryInsert,
    queryFindByName,
    queryDeleteByName,
    queryFindByNameAndCod
} = require('../models/departamento')

const auth = require('../middlewares/auth')
const searchByKeyAndUpdate = require('../utils/update')

router.post('/departamento', auth, async (req, res) => {
    queryInsert.values = [req.body.codigo_dept, req.body.nome_dept.toLowerCase(), req.body.classificacao.toLowerCase(), req.body.gerente]
    try {
        const newDepartment = await pool.query(queryInsert)

        if (!newDepartment.rowCount)
            return res.status(400).send()

        queryFindByName.values = [req.body.nome_dept]
        const departamento = await pool.query(queryFindByName)

        res.status(201).send(departamento.rows)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/departamento', auth, async (req, res) => {
    try {
        queryFindByName.values = [req.header('nome')]
        const departamento = await pool.query(queryFindByName)

        if (!departamento.rowCount)
            return res.status(404).send()

        res.send(departamento.rows[0])
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/departamento/all', auth, async (req, res) => {
    try {
        const departamento = await pool.query('SELECT * FROM Departamento AS d LEFT JOIN Usuario AS u ON u.cpf = d.gerente')

        if (!departamento.rowCount)
            return res.status(404).send()

        res.send(departamento.rows)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/departamento', auth, async (req, res) => {
    const codigo = req.body.searchTerm.codigo_dept
    const nome = req.body.searchTerm.nome_dept

    try {
        const departamento = await searchByKeyAndUpdate(req.body, 'Departamento', ['codigo_dept', 'nome_dept'],
            [codigo, nome], queryFindByNameAndCod, ['codigo_dept', 'nome_dept', 'classificacao', 'gerente'],
            ['codigo_dept'])

        res.send(departamento)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/departamento', auth, async (req, res) => {
    try {
        queryDeleteByName.values = [req.header('codigo_dept')]
        const departamento = await pool.query(queryDeleteByName)

        if (!departamento.rowCount)
            return res.status(404).send()

        res.send({ msg: 'O departamento foi deletado.' })
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router