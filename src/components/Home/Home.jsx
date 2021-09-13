import { Component } from "react";
import { useDropzone } from 'react-dropzone';

import "./Dropzone.css"


class Home extends Component {
    state = {};

    render() {
        return (
            <div>
                <h2>Home</h2>
                <div>
                    <Basic />
                </div>
            </div>


        );
    }
}

export default Home;

function Basic(props) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}