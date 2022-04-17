import { Component, h, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'file-input',
  styleUrl: 'file-input.css',
  shadow: true,
})
export class FileInput {
  @Event() inputChange: EventEmitter<File>;

  /**
   * Determines if input is visible
   */
  @Prop() visible: boolean = false;

  /**
   * Sets the materialize icon to use
   */
  @Prop() icon: string = 'add';

  /**
   * String of comma-separated file types. All types allowed by default
   */
  @Prop() accept: string = ''
  
  
  handleInputChange(e) {
    const target = e.target
    this.inputChange.emit(target?.files)
  }

  render() {
    return (
      <label style={{ display: this.visible ? 'inline' : 'none' }} htmlFor="file-input-component">
        <span title="Add file" class="small material-icons hover">{this.icon}</span>
        {
          this.accept ?
          <input 
            id="file-input-component"
            accept={this.accept}
            style={{ display: 'none' }} 
            onChange={(e) => this.handleInputChange(e)} 
            multiple={true} 
            type='file'
          ></input> :
          <input 
            id="file-input-component"
            style={{ display: 'none' }} 
            onChange={(e) => this.handleInputChange(e)} 
            multiple={true} 
            type='file'
          ></input>
        }
        
      </label>
    )
  }
}