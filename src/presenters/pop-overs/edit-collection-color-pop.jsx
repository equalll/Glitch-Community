import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

import {throttle} from 'lodash';

const validHex = (hex) =>{
  var re = /[0-9A-Fa-f]{6}/g;
  if(re.test(hex)){
    return true;
  }
  return false;
};

class EditCollectionColorPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: this.props.initialColor,
      color: this.props.initialColor,
      maybeRequest: null,
      maybeResults: null
    };
    
    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this); // for when user enters in custom hex
    this.keyPress = this.keyPress.bind(this); // handles enter key for custom hex
    this.getRandomColor = this.getRandomColor.bind(this); // gets random color
    this.changeColor = throttle(this.changeColor.bind(this), 250); // get update from system color picker
    this.update = this.props.updateColor;
  }
    
  handleChange(e) {
    let query = e.currentTarget.value.trim();
    const errorMsg = document.getElementsByClassName("editable-field-error-message")[0];
    errorMsg.style.display = "none";
    this.setState({ query });
    if (query && query.length <=7) {
      if(validHex(query)){
        if(query[0] !== "#"){
          query = "#" + query;
        }
        this.setState({color: query});
        this.update(query);
      }else{
        errorMsg.style.display = "inherit";
      }
    }else{
      // user has cleared the input field
      errorMsg.style.display = "inherit";
    }
  }
  
  keyPress(e){
    if(e.which == 13 || e.keyCode == 13){
      // enter key pressed - dismiss pop-over
      this.props.togglePopover();
    }else{
      document.getElementsByClassName("editable-field-error-message")[0].style.display = "none";
    }
  }
    
  onClick() {
    this.props.togglePopover();
  }
  
  getRandomColor(){
    let newCoverColor = randomColor({luminosity: 'light'});
    this.setState({ color: newCoverColor});
    this.setState({ query: newCoverColor});
    this.update(newCoverColor);
  }
  
  changeColor(color){
    // upate the UI manually to prevent lag
    document.getElementById("color-picker").value = color;
    document.getElementById("color-picker").style.backgroundColor = color;
    this.setState({ color: color });
    this.setState({ query: color});    
    this.update(color);
  }
  
  render() {    
    return (
      <dialog className="pop-over edit-collection-color-pop">
        <section className="pop-over-info">          
                  
          <input className="color-picker" type="color" value={this.state.color} onChange={(e) => this.changeColor(e.target.value)} style={{backgroundColor: this.state.color}} id="color-picker"></input>
          
          <div className="custom-color-input">
            <input id="color-picker-hex"
              value={this.state.query} 
              onChange={this.handleChange} 
              onKeyPress={this.keyPress}
              className={"pop-over-input pop-over-search"}
              placeholder="Custom color hex"
            />

            <div className="editable-field-error-message">
              Invalid Hex
            </div>
          </div>
          
        </section>
          
        <section className="pop-over-info">  
          <button className="random-color-btn button-tertiary" onClick={this.getRandomColor}>Random <span className="emoji bouquet"></span></button>
        </section>
        
      </dialog>
    );
  }
}

EditCollectionColorPop.propTypes = {
  updateColor: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
};

export default EditCollectionColorPop;