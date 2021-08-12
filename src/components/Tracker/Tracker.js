import React, { Component } from 'react';
import './Tracker.css';
import fire from '../../config/fire';
import Change from './Change/Change';

class Tracker extends Component {

    state = {
        changes: [],
        weight: 0,

        changeName: '',
        changeType: '',
        mass: '',
        currentUID: fire.auth().currentUser.uid
    }

    // logout function
    logout = () => {
        fire.auth().signOut();
    }

    handleChange = input => e => {
        this.setState({
            [input]: e.target.value !=="0" ? e.target.value : ""
        });
    }

    // add transaction
    addNewChange = () => {
        const {changeName, changeType, mass, currentUID, weight} = this.state;

        // validation
        if(changeName && changeType && mass){

            const BackUpState = this.state.changes;
            BackUpState.push({
                id: BackUpState.length + 1,
                name: changeName,
                type: changeType,
                mass: mass,
                user_id: currentUID
            });
            
            fire.database().ref('Changes/' + currentUID).push({
                id: BackUpState.length,
                name: changeName,
                type: changeType,
                mass: mass,
                user_id: currentUID
            }).then((data) => {
                //success callback
                console.log('success callback');
                this.setState({
                    changes: BackUpState,
                    money: changeType === 'loss' ? weight + parseFloat(mass) : weight - parseFloat(mass),
                    changeName: '',
                    changeType: '',
                    mass: ''
                })
            }).catch((error)=>{
                //error callback
                console.log('error ' , error)
            });

        }
    }

    componentWillMount(){
        const {currentUID, weight} = this.state;
        let totalweight = weight;
        const BackUpState = this.state.changes;
        fire.database().ref('Changes/' + currentUID).once('value',
        (snapshot) => {
            // console.log(snapshot);
            snapshot.forEach((childSnapshot) => {

                totalweight = 
                    childSnapshot.val().type === 'loss' ? 
                     totalweight - parseFloat(childSnapshot.val().mass) 
                    : totalweight + parseFloat(childSnapshot.val().mass);
                
                BackUpState.push({
                    id: childSnapshot.val().id,
                    name: childSnapshot.val().name,
                    type: childSnapshot.val().type,
                    mass: childSnapshot.val().mass,
                    user_id: childSnapshot.val().user_id
                });
                // console.log(childSnapshot.val().name);
            });
            this.setState({
                changes: BackUpState,
                weight: totalweight
            });
        });
    }

    render(){
        var currentUser = fire.auth().currentUser;
        return(
            <div className="trackerBlock">
                <div className="welcome">
                    <span>Hi, {currentUser.displayName} !</span>
                    <button className="exit" onClick={this.logout}>Exit</button>
                </div>
                <div className="totalWeight">Total Weight : {this.state.weight}</div>

                <div className="newChangeBlock">
                    <div className="newChange">
                        <form>
                            <input
                                onChange={this.handleChange('changeName')}
                                value={this.state.changeName}
                                placeholder="DD/MM/YYYY"
                                type="text"
                                name="changeName"
                            />
                            <div className="inputGroup">
                                <select name="type"
                                    onChange={this.handleChange('changeType')}
                                    value={this.state.changeType}>
                                    <option value="0">Type</option>
                                    <option value="gain">Gain</option>
                                    <option value="loss">Loss</option>
                                </select>
                                <input
                                    onChange={this.handleChange('mass')}
                                    value={this.state.mass}
                                    placeholder="Mass (in kg)"
                                    type="text"
                                    name="mass"
                                />
                            </div>
                              <button className="addChange" 
                        onClick={() => this.addNewChange()} >
                            Entry</button>
                        </form>
                      
                    </div>
                </div>
                
                <div className="latestChanges">
                    <p>Latest Transactions</p>
                    <ul>
                        {
                            Object.keys(this.state.changes).map((id) => (
                                <Change key={id}
                                    type={this.state.changes[id].type}
                                    name={this.state.changes[id].name}
                                    mass={this.state.changes[id].mass}
                                />
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Tracker;