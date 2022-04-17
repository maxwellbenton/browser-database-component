import { Component, Prop, h, State, Listen, Method, Event, EventEmitter, Watch } from '@stencil/core';
import { openDB } from 'idb';

@Component({
  tag: 'browser-database',
  styleUrl: 'browser-database.css',
  shadow: true,
})
export class BrowserDatabase {
  //life cycle

  async componentWillLoad() {
    const dbName = this.dbName
    const storeName = this.dbStoreName
    this.promiseDatabase = openDB(dbName, 1, {
      upgrade: (db) => {
        db.createObjectStore(storeName);
      },
    });

    if (this.geotag) this.handleGeolocation()
    await this.checkForManifest()
    this.checkForManifestUpdates()
    this.updateList()
  }

  // state

  /**
   * Determines visibility of db modal
   */
   @State() opened: boolean = false;
  
   /**
    * Determines visibility of preview modal
    */
   @State() previewOpened: boolean = false;
   
    /**
    * Determines visibility of URL input
    */
   @State() urlInputOpened: boolean = false;
   
   /**
    * Boolean to determine if loading indicators should be displayed
    */
   @State() loading: boolean = true;
 
   /**
    * Database interface
    */
   @State() promiseDatabase: any;
   
   /**
    * Manifest of database items information
    */
   @State() manifest: any = {
     files: {}
   };
 
   /**
    * Current file from either the database or recent upload
    */
   @State() file: any;
 
   /**
    * Name of the current file
    */
  @State() selectedFileName: string;
  
  /**
   * Stores current geolocation information from navigator.geolocation.getCurrentLocation()
   */
  @State() coords: any = {};

  /**
   * Name of the manifest that tracks file metadata
   */
  @State() manifestName: string = null;
  
  // props

  /**
   * Determines visibility of component
   */
  @Prop() visible: boolean = false;

  /**
   * Sets dark or light theme
   */
  @Prop() theme: string = 'dark';

  /**
   * If true, geolocation info for files will be saved in the file manifest
   */
  @Prop() geotag: boolean = false;

  /**
   * If true, a timestamp for files will be saved in the file manifest
   */
  @Prop() timetag: boolean = false;

  /**
   * Name of the database
   */
  @Prop() dbName: string = 'file-store-database'

  /**
   * Name of the database store
   */
  @Prop() dbStoreName: string = 'file-store'
  @Watch('dbStoreName')
  async updateManifestName(newValue) {
    await this.delete(this.manifestName)
    this.manifestName = newValue + '-manifest'
    this.checkForManifestUpdates()
  }
  
  /**
   * String of comma-separated file types. All types allowed by default
   */
  @Prop() accept: string = ''
  
  /**
   * Materialize icon to use for the component if visible
   */
  @Prop() icon: string = 'folder'

  // private methods

  async handleGeolocation() {
    const { coords } = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    this.coords = coords
  }

  async checkForManifest() {
    const manifest = await this.get(this.manifestName)
    if (manifest) {
      this.manifest = manifest
    }
  }

  async checkForManifestUpdates() {
    const filenames = await this.keys()

    let changes = false
    await Promise.all(filenames.map(async (filename) => {
      if (this.manifest.files?.[filename]) return
      changes = true
      const file = await this.get(filename)
      let type
      try {
        type = file.type || typeof file
      } catch (e) {}
      this.manifest.files[filename] = {
        size: file.size || null,
        type
      }
    }));
    if (changes) await this.saveManifest()
  }

  async saveManifest() {
    try {
      await this.set(this.manifestName, this.manifest)
    } catch (e) { console.error(e) }
  }

  updateList(selectedFilename: string = null) {
    const filenames = this.filenames()
    if (filenames.length) this.setSelectedFile(selectedFilename || filenames[0])
  }

  filenames() { return Object.keys(this.manifest.files).filter(key => key !== this.manifestName)}

  async addFile(key, file) {
    try {
      this.updateManifest(key, file)
      await this.set(key, file)
      await this.saveManifest()
      this.updateList(key)
      this.setSelectedFile(key, 2)
    } catch (e) { console.error(e); return false }
  }
  
  updateManifest(filename, file) {
    this.manifest.files[filename] = {}
    if (file.size) this.manifest.files[filename].size = file.size 
    if (this.timetag) this.manifest.files[filename].timetag = Date.now() 
    if (this.geotag) this.manifest.files[filename].geolocation = {
      latitude: this.coords.latitude,
      longitude: this.coords.longitude,
      altitude: this.coords.altitude
    }
  }

  async setSelectedFile(key, clicks = 1) {
    this.loading = true
    this.selectedFileName = key
    this.file = await this.get(key)
    console.warn('f', key, this.file)
    if (clicks > 1) this.togglePreviewModal(true)
    this.loading = false
  }

  async toggleModal(e, value = null) {
    e?.preventDefault()
    this.opened = value || !this.opened
    if (this.opened) {
      this.modalOpened.emit(this)
    } else {
      this.modalClosed.emit(this)
    }
  }

  async togglePreviewModal(value = null) {
    this.previewOpened = value || !this.previewOpened
  }
  
  listFiles() {
    return this.filenames().map((filename) => {
      return (
        <div class={this.selectedFileName === filename ? 'selected' : ''} onClick={(event) => this.setSelectedFile(filename, event.detail)}>
          <h3 class="hover">{filename} Size: {this.manifest.files[filename].size || 'n/a'}</h3>
        </div>
      )
    })
  }

  displayTypeInterface() {
    console.log('?', this.file)
    if (!this.selectedFileName || !this.file) return <p>No file selected</p>
    if (this.loading) return <div class="prev"><p>Loading...</p></div>
    try {
      
      if (this.file.type) {
        const source = URL.createObjectURL(this.file)
        if (this.file.type.includes('image')) {
          return <img src={source}></img>
        }
        if (this.file.type.includes('audio')) {
          return (
            <div class="prev">
              <audio controls>
                <source src={source} type={this.file.type} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )
        }
      }
      if (typeof this.file === 'string') {
        return <pre>{this.file}</pre>
      }
      if (typeof this.file === 'object') {
        return <pre>{JSON.stringify(this.file)}</pre>
      }
    } catch (e) {console.warn(e)}
    
    return <p>The {this.file.type} type cannot be previewed at this time</p>
  }

  // Public methods

  @Method()
  async getManifest() {
    try {
      return this.manifest
    } catch (e) { console.error(e); return [] }
  };

  @Method()
  async keys() {
    try {
      return (await this.promiseDatabase).getAllKeys(this.dbStoreName);
    } catch (e) { console.error(e); return [] }
  };

  @Method()
  async set(key, val) {
    try {
      if (!key || !val) return
      return await (await this.promiseDatabase).put(this.dbStoreName, val, key);
    } catch (e) { console.error(e, key); return false }
  };

  @Method()
  async get(key) {
    try {
      if (!key) return
      return await (await this.promiseDatabase).get(this.dbStoreName, key);
    } catch (e) { console.error(e); return false }
  };

  @Method()
  async delete(key) {
    try {
      if (!key) return
      const result = (await this.promiseDatabase).delete(this.dbStoreName, key);
      this.file = null
      delete this.manifest.files[key]
      this.updateList()
      return result
    } catch (e) { console.error(e); return false }
  };

  @Method()
  async deleteDatabase() {
    try {
      (await this.promiseDatabase).clear(this.dbStoreName);
      this.file = null
      this.selectedFileName = null
      this.manifest.files = {}
      await this.saveManifest()
    } catch (e) { console.error(e); return false }
  };

  @Method()
  async close() {
    try {
      this.opened = false
      this.modalClosed.emit(this)
    } catch (e) { console.error(e) }
  };

  @Method()
  async open() {
    try {
      this.opened = true
      this.modalOpened.emit(this)
    } catch (e) { console.error(e) }
  };

  @Event() modalClosed: EventEmitter<BrowserDatabase>
  @Event({
    cancelable: true,
    bubbles: true,
  }) modalOpened: EventEmitter<BrowserDatabase>

  @Listen('inputChange')
  handleInput(e) {
    const fileset = e.detail
    Object.keys(fileset).forEach(el => {
      const file = fileset[el]
      const selectedFileName = fileset[el].name
      this.addFile(selectedFileName, file)
    })
  }

  render() {
    return (
      <div 
        style={{display: this.visible ? 'block' : 'none'}}
        class="container"
      >
        <div class={`browser-database ${this.theme} ${this.opened}`}>
          <i class='folder-button' onClick={(e) => this.toggleModal(e)}>
            <span class="tiny material-icons">{this.icon}</span>
          </i>
        </div>
        { 
          this.opened && 
          <div class={`${this.theme} absolute-container`}>
            <div class="modal">
              <section>
                <span title="Files listed here are stored in your browsers IndexDB" class="tiny material-icons help">help_outline</span>
                <span title="Open Preview" onClick={() => this.togglePreviewModal()} class="tiny material-icons hover">visibility</span>
                <span title="Close" onClick={(e) => this.toggleModal(e, false)} class="close tiny material-icons hover">close</span>
              </section>
              <section id="list">
                {this.listFiles()}
              </section>   
              <section class="controls">
                <div>
                  <file-input visible={true} icon="add" accept={this.accept} />
                  <span onClick={() => this.delete(this.selectedFileName)} title="Remove file" class="small material-icons hover">remove</span>
                </div>
                <div>
                  <span onClick={() => this.deleteDatabase()} title="Delete all" class="small material-icons hover">delete_forever</span>
                </div>
              </section>         
            </div>
            {
              this.previewOpened &&
              <div class="modal preview">
                <section>
                  <span title="Close" onClick={() => this.togglePreviewModal(false)} class="close tiny material-icons hover">close</span>
                </section>
                <section class="preview-display">
                  {this.displayTypeInterface()}
                </section>
                <section>

                </section>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}
