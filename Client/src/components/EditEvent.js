import React from 'react';

class EditEvent extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        if(this.props.match.params.id){
            alert('yu')
        }
    }
    render(){
        return (
            <div>
                
            </div>
        )
    }
}

export default EditEvent;