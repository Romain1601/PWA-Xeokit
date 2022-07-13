//------------------------------------------------------------------------------------------------------------------
// Import the modules we need for this example
//------------------------------------------------------------------------------------------------------------------

import {Viewer, XKTLoaderPlugin, AnnotationsPlugin, NavCubePlugin} from "../js/xeokit-sdk.es.js";

//------------------------------------------------------------------------------------------------------------------
// Create a Viewer and arrange the camera
//------------------------------------------------------------------------------------------------------------------

const viewer = new Viewer({
    canvasId: "myCanvas"
});

viewer.camera.eye = [1841982.5187600704, 19.207790938410042, -5173303.042326414];
viewer.camera.look = [1842011.793756829, 9.913817421536704, -5173299.841616623];
viewer.camera.up =[0.2991762376746394, 0.9536370664170352, 0.0327096983532173];

new NavCubePlugin(viewer, {
    canvasId: "myNavCubeCanvas",
    color: "lightblue",
    visible: true,           // Initially visible (default)
    cameraFly: true,       // Fly camera to each selected axis/diagonal
    cameraFitFOV: 45,        // How much field-of-view the scene takes once camera has fitted it to view
    cameraFlyDuration: 0.5 // How long (in seconds) camera takes to fly to each new axis/diagonal
});

//------------------------------------------------------------------------------------------------------------------
// Load a model
//------------------------------------------------------------------------------------------------------------------

const xktLoader = new XKTLoaderPlugin(viewer);

const sceneModel = xktLoader.load({
    id: "myModel",
    src: "models/xkt/MAP.gltf.xkt",
    edges: true
});

//------------------------------------------------------------------------------------------------------------------
// Create an AnnotationsPlugin, with which we'll create annotations
//------------------------------------------------------------------------------------------------------------------

const annotations = new AnnotationsPlugin(viewer, {

    markerHTML: "<div class='annotation-marker' id='annotation-marker' style='background-color: {{markerBGColor}};'>{{glyph}}</div>",
    labelHTML: "<div class='annotation-label' style='background-color: {{labelBGColor}};'><div class='annotation-title'>{{title}}</div><div class='annotation-desc'>{{description}}</div></div>",

    values: {
        markerBGColor: "red",
        glyph: "X",
        title: "Untitled",
        description: "No description"
    },

    surfaceOffset: 0.3
});

annotations.on("markerMouseEnter", (annotation) => {
    annotation.setLabelShown(true);
});

annotations.on("markerMouseLeave", (annotation) => {
    annotation.setLabelShown(false);
});

//------------------------------------------------------------------------------------------------------------------
// Use the AnnotationsPlugin to create an annotation wherever we click on an object
//------------------------------------------------------------------------------------------------------------------

var i = 0;
var titre = "";
var description = "";
var imageSource;
var image;
var logoAnnotation;
var colorAnnotation;
const myModal = new bootstrap.Modal(document.getElementById('myModal'))

viewer.scene.input.on("mouseclicked", (coords) => {

    const pickResult = viewer.scene.pick({
        canvasPos: coords,
        pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
    });
    

    if (pickResult) {
        myModal.show()
        viewer.scene.input.setEnabled(false);

        //Gère l'ouverture du modal
        $("#submit").click(function() {

            const pickResult = viewer.scene.pick({
                canvasPos: coords,
                pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
            });
            
            //Recuperation des valeurs entrées par l'utilisateur
            $("#inputs").each(function() {
                titre = $("#titreannotation option:selected").text();
                description = $("#descriptionannotation").val();
                image = $("#formFile").get(0).files
            });

            if(titre == "Fuite d'eau"){
                logoAnnotation = "F"
                colorAnnotation = "blue"
                
            }
            else if (titre == "Dégradation"){
                logoAnnotation = "D"
                colorAnnotation = "red"
            }
            else {
                logoAnnotation = "X"
                colorAnnotation = "black"
            }
            

            

            const annotation = annotations.createAnnotation({
                id:"myAnnotation" + i,
                worldPos:[pickResult.worldPos[0], pickResult.worldPos[1], pickResult.worldPos[2]],
                occludable: false,
                markerShown: true,
                labelShown: false,
                labelHTML: "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
                    <div class='annotation-title'>{{title}}</div>\
                    <div class='annotation-desc'>{{description}}</div>\
                    <br><img alt='myImage' width='150px' height='100px' src='{{imageSrc}}'>\
                    </div>",
                values: {
                    glyph: logoAnnotation,
                    title: titre,
                    description: description,
                    markerBGColor: colorAnnotation,
                    //imageSrc: URL.createObjectURL(image[0])
                    //imageSrc: imageSource
                },

            })
            

            if (image.length !== 0){
                console.log(annotation.plugin)
                imageSource = URL.createObjectURL(image[0])
                annotation.setValues({imageSrc: imageSource})
            }
            else {
                annotation._labelHTML = "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
                <div class='annotation-title'>{{title}}</div>\
                <div class='annotation-desc'>{{description}}</div>\
                </div>"
            }

            //Régle le probleme des annotations qui se créée en plus lorsqu'on clique sur le modal
            var idannotation = Object.keys(annotations.annotations);
            idannotation.forEach((t) => {
                if(t.startsWith("__")){
                    annotations.destroyAnnotation(t)
                }
            })
            $("#myModal").hide(); 
            $("#inputs")[0].reset();
            viewer.scene.input.setEnabled(true);

            

        });

        $("#partageImg").click(function() {
            const pickResult = viewer.scene.pick({
                canvasPos: coords,
                pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
            });
            
            //Recuperation des valeurs entrées par l'utilisateur
            $("#inputs").each(function() {
                titre = $("#titreannotation option:selected").text();
                description = $("#descriptionannotation").val();
                image = $("#formFile").get(0).files
            });

            if(titre == "Fuite d'eau"){
                logoAnnotation = "F"
                colorAnnotation = "blue"
                
            }
            else if (titre == "Dégradation"){
                logoAnnotation = "D"
                colorAnnotation = "red"
            }
            else {
                logoAnnotation = "X"
                colorAnnotation = "black"
            }
            

            

            const annotation = annotations.createAnnotation({
                id:"myAnnotation" + i,
                worldPos:[pickResult.worldPos[0], pickResult.worldPos[1], pickResult.worldPos[2]],
                occludable: false,
                markerShown: true,
                labelShown: false,
                labelHTML: "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
                    <div class='annotation-title'>{{title}}</div>\
                    <div class='annotation-desc'>{{description}}</div>\
                    <br><img alt='myImage' width='150px' height='100px' src='{{imageSrc}}'>\
                    </div>",
                values: {
                    glyph: logoAnnotation,
                    title: titre,
                    description: description,
                    markerBGColor: colorAnnotation,
                    //imageSrc: URL.createObjectURL(image[0])
                    //imageSrc: imageSource
                },

            })
            

            if (image.length !== 0){
                console.log(annotation.plugin)
                imageSource = URL.createObjectURL(image[0])
                annotation.setValues({imageSrc: imageSource})
                

            }
            else {
                annotation._labelHTML = "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
                <div class='annotation-title'>{{title}}</div>\
                <div class='annotation-desc'>{{description}}</div>\
                </div>"
            }

            //Régle le probleme des annotations qui se créée en plus lorsqu'on clique sur le modal
            var idannotation = Object.keys(annotations.annotations);
            idannotation.forEach((t) => {
                if(t.startsWith("__")){
                    annotations.destroyAnnotation(t)
                }
            })
            $("#myModal").hide(); 
            $("#inputs")[0].reset();
            viewer.scene.input.setEnabled(true);

            
            var canvas2 = document.getElementById("myCanvas2");
            canvas2.width = document.documentElement.clientWidth
            canvas2.height = document.documentElement.clientHeight
            var ctx1 = canvas2.getContext("2d");
            ctx1.strokeStyle = 'black';
            ctx1.fillStyle = 'rgba(0,0,0,0.3)';
            ctx1.beginPath();
            ctx1.arc(coords[0], coords[1], 10, 0, 2 * Math.PI, false);
            ctx1.stroke();
            ctx1.fill();

            var element = document.getElementById("myCanvas");
            
      
            var mergeimage = mergeImages([element.toDataURL(), canvas2.toDataURL()]).then(
                b64 => document.getElementById("image").src = b64
            )
            mergeimage.then(datasrc => writeToClipboard(dataURItoBlob(datasrc)))

            //Création du blob de la photo à partir du src de l'image
            function dataURItoBlob(dataURI) {
                // convert base64 to raw binary data held in a string
                // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
                var byteString = atob(dataURI.split(',')[1]);
              
                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
              
                // write the bytes of the string to an ArrayBuffer
                var ab = new ArrayBuffer(byteString.length);
              
                // create a view into the buffer
                var ia = new Uint8Array(ab);
              
                // set the bytes of the buffer to the correct values
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
              
                // write the ArrayBuffer to a blob, and you're done
                var blob = new Blob([ab], {type: mimeString});
                return blob;
              
            }

            //Copie dans le presse-papier
            async function writeToClipboard(imageBlob) {
                try {
                  await navigator.clipboard.write([
                    new ClipboardItem({
                      'image/png': imageBlob,
                    }),
                  ]);
                } catch (error) {
                  console.error(error);
                }
            }
        

        })

        i++;

        $("#closebutton").click(function() {
            viewer.scene.input.setEnabled(true);
        })

        
    }

    


});

window.viewer = viewer;

window.onoffline = (event) => {
    alert("La connexion au réseau a été perdue.");
};

window.ononline = (event) => {
    alert("La connexion au réseau réussi.");
};
