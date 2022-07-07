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

    markerHTML: "<div class='annotation-marker' style='background-color: {{markerBGColor}};'>{{glyph}}</div>",
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
            var test = Object.keys(annotations.annotations);
            test.forEach((t) => {
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
            var test = Object.keys(annotations.annotations);
            test.forEach((t) => {
                if(t.startsWith("__")){
                    annotations.destroyAnnotation(t)
                }
            })
            $("#myModal").hide(); 
            $("#inputs")[0].reset();
            viewer.scene.input.setEnabled(true);

            const canvas = viewer.scene.canvas;
            const canvasElement = canvas.canvas;
            const aspect = canvasElement.height / canvasElement.width;
            const width = 200;
            const height = Math.floor(width * aspect);

            const imageData = viewer.getSnapshot({
                format: "png",
                width: width*5,
                height: height*5
            });

            var element = document.getElementById("myCanvas");
            html2canvas(element).then(function(canvas) {
                //Export the canvas to its data URI representation
                var base64image = canvas.toDataURL("image/png");

                //Open the image in a new window
                window.open(base64image , "_blank");
            });
        

        })

        i++;

        $("#closebutton").click(function() {
            viewer.scene.input.setEnabled(true);
        })

        
    }
});

/* sceneModel.on("loaded", () => {
    annotations.createAnnotation({
        id: "myAnnotation0",
        /////////////////////////////////////////  Entity
        worldPos: [1842010.9378785258, 19.817048380610856, -5173294.766843413],
        occludable: false,
        markerShown: true,
        labelShown: false,

        labelHTML: "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
            <div class='annotation-title'>{{title}}</div>\
            <div class='annotation-desc'>{{description}}</div>\
            <br><img alt='myImage' width='150px' height='100px' src='{{imageSrc}}'>\
            </div>",

        values: {
            glyph: "A0",
            title: "The West wall",
            description: "Annotations can contain<br>custom HTML like this<br>image:",
            markerBGColor: "red",
            imageSrc: "https://xeokit.io/img/docs/BIMServerLoaderPlugin/schependomlaan.png"
        },

    });
}) */

window.viewer = viewer;

window.onoffline = (event) => {
    alert("La connexion au réseau a été perdue.");
};

window.ononline = (event) => {
    alert("La connexion au réseau réussi.");
};