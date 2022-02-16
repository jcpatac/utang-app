import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    state = {
        data: null
    };
    
    // fetching the GET route from the Express server which matches the GET route from server.js
    async fetchUsers() {
        let response = await fetch('http://localhost:9000/users');
        // let body = response.json();
        let body = response.json();
        
        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }

    async createUser() {
        let data = {
            first_name: 'Test',
            last_name: 'User',
            email: 'test@test.com',
            password: 'pass'
        };
        let options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        let response = await fetch('http://localhost:9000/register', options);
        
        if (response.status !== 201) {
            throw response;
        }
        return response.json();
    }

    async loginUser() {
        let data = {
            email: 'example@example.com',
            password: 'test'
        };
        let options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        let response = await fetch('http://localhost:9000/login', options);
        if (response.status !== 200) {
            throw Error('Error');
        }
        return response.json();
    }

    async searchUser(keyword) {
        let response = await fetch('http://localhost:9000/users/search?keyword=' + keyword);
        return response.json();
    }

    componentDidMount() {
        // this.fetchUsers().then(res => {
        //     console.log(res);
        // });

        this.createUser().then(res => {
            console.log(res);
        }).catch(err => {
            console.error('Error');
            // console.error(err.json());
        });

        // this.loginUser().then(res => {
        //     console.log(res);
        // });

        // this.searchUser('doe').then(res => {
        //     console.log(res);
        // });
    }
    
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">{this.state.data}</p>
            </div>
        );
    }
}

export default App;
