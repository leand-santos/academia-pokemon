import React, { useState, useEffect } from 'react'
import deleteImg from '~/assets/icons/delete-black-24dp.svg'
import Spinner from 'react-loading'

import Card from 'react-bootstrap/Card'
import CardImage from 'react-bootstrap/CardImg'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'

import AlertMessage from '~/components/PopUp/Alert'


import { api } from '~/services/api'

import UserTemplate from '~/templates/UserTemplate'

export default function Upgrade({ history }) {
    const [departments, setDepartments] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    async function loadDeparment() {
        const userCpf = localStorage.getItem('cpf')
        try {
            const response = await api.get('departamento/all', {
                headers: {
                    Authorization: 'Bearer ' + userCpf
                }
            })
            setDepartments(response.data)
        } catch (e) {
            alert(e)
        }
    }

    async function handleDelete(e, codigo_dept) {
        e.preventDefault()

        try {
            await api.delete('/departamento', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('cpf'),
                    codigo_dept
                }
            })
            
            setShowSuccess(true)
        } catch (e) {
            setShowError(true)
        }
    }

    useEffect(() => {
        loadDeparment()
    }, [showSuccess, showError])

    return (
        <div>
            {
                !localStorage.getItem('cpf') || !localStorage.getItem('mhaighstir') ? (
                    history.push('/')
                ) : departments.length > 0 ? (
                    <UserTemplate history={history}>
                        <div className="w-100 d-flex flex-column mb-5">
                            <h2 className="text-center">Seus departamentos</h2>
                        </div>
                        <AlertMessage show={showSuccess} setShow={setShowSuccess}
                            title="Sucesso"
                            msg={`Seu departamento foi foi deletado com sucesso :)`}
                            button="Fechar"
                            func={() => { setShowSuccess(false) }}
                            colorAlert="success"
                            colorButton="outline-success"
                        />
                        <AlertMessage show={showError} setShow={setShowError}
                            title="Erro"
                            msg={`Seu departamento não foi foi deletado com sucesso :(`}
                            button="Fechar"
                            func={() => setShowError(false)}
                            colorAlert="danger"
                            colorButton="outline-danger"
                        />
                        <div className="d-flex flex-row flex-wrap justify-content-center">
                            {
                                departments.map(department => {
                                    return (
                                        <Card key={department.codigo_dept} className="w-auto mr-5 mb-5">
                                            <Card.Body className="mb-3 mt-3">
                                                <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                                                    <Card.Title className="m-0"><span style={{ textTransform: 'capitalize' }}>{department.nome_dept}</span></Card.Title>
                                                    <CardImage className="hover-cursor" src={deleteImg} style={{ width: '24px' }} alt="abrir" onClick={(e) => handleDelete(e, department.codigo_dept)} />
                                                </div>
                                                <Card.Text>
                                                    Código: {department.codigo_dept}
                                                </Card.Text>
                                                <ListGroup className="list-group-flush" variant="dark" text="light">
                                                    <ListGroupItem className="d-flex flex-column" variant="light" text="dark">
                                                        Classificação: <span style={{ textTransform: 'capitalize' }}>{department.classificacao}</span>
                                                    </ListGroupItem>
                                                    <ListGroupItem className="d-flex flex-column" variant="light" text="dark">
                                                        Gerente: <span style={{ textTransform: 'capitalize' }}>{department.nome}</span>
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Card.Body>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                    </UserTemplate>

                ) : (departments.length === 0) ? (
                    <UserTemplate history={history}>
                        <h6>Você não tem nenhum trabalho pendente!</h6>
                    </UserTemplate>
                ) : (
                                <UserTemplate history={history}>
                                    <div className="d-flex justify-content-center my-5 py-5" >
                                        <Spinner type="bars" width={'32px'} height={'32px'} color={'green'} />
                                    </div>
                                </UserTemplate>
                            )
            }
        </div >
    )
}
