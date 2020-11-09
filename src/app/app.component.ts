import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Object3D } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public scene = new THREE.Scene();
  public camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, .1, 1000);
  public renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  public light = new THREE.DirectionalLight(0xffffff, 1);
  public loader = new THREE.FontLoader();
  public controls = new OrbitControls(this.camera, this.renderer.domElement);

  public objects = [];
  public spread = 15



  ngOnInit() {
    this.init();
  }

  private init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(0xaaaaaa);
    this.camera.position.z = 120;
    this.light.position.set(-1, 2, 4);
    this.controls.update();
    this.scene.add(this.light);

    const pointGeometry = new THREE.SphereBufferGeometry(7, 12, 8);
    const pointMaterial = new THREE.PointsMaterial({
      color: 'black',
      sizeAttenuation: false,
      size: 5
    });
    const points = new THREE.Points(pointGeometry, pointMaterial);

    this.objects.push(points);
    this.scene.add(points);

    // this.addSolidGeometry(-2, 2, new THREE.BoxBufferGeometry(8, 8, 8));
    // this.addSolidGeometry(-1, 2, new THREE.CircleBufferGeometry(7, 24));
    // this.addSolidGeometry(0, 2, new THREE.ConeBufferGeometry(6, 8, 16));
    // this.addSolidGeometry(1, 2, new THREE.CylinderBufferGeometry(4, 4, 8, 12));
    // this.addSolidGeometry(2, 2, new THREE.DodecahedronBufferGeometry(7));
    // this.addSolidGeometry(-1, 1, new THREE.IcosahedronBufferGeometry(7));
    // this.addSolidGeometry(1, -1, new THREE.TorusBufferGeometry(5, 2, 8, 24));

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);

    // this.doIt();

    const animate = () => {
      this.objects.forEach(obj => {
          // obj.rotation.x += .05;
          obj.rotation.y += .05;
      });

      this.controls.update()

      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(animate);
    }
    animate();
  }

  private addObjects(x: number, y: number, obj: Object3D) {
    obj.position.x = x * this.spread;
    obj.position.y = y * this.spread;

    this.scene.add(obj);
    this.objects.push(obj);
  }

  private createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = .5;

    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  private addSolidGeometry(x: number, y: number, geometry: any) {
    const mesh = new THREE.Mesh(geometry, this.createMaterial());
    this.addObjects(x, y, mesh);
  }

  private async doIt() {
    const font: any = await this.loadFont('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json');
    const geometry = new THREE.TextBufferGeometry('Hello World', {
      font: font,
      size: 3.0,
      height: .2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: .15,
      bevelSize: .3,
      bevelSegments: 5
    });

    this.addSolidGeometry(-.5, 0, geometry);

    const mesh = new THREE.Mesh(geometry, this.createMaterial());
    geometry.computeBoundingBox();
    geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

    const parent = new THREE.Object3D();
    parent.add(mesh);

    this.addObjects(.5, 0, parent);
  }

  private loadFont(url) {
    return new Promise((res, rej) => {
      this.loader.load(url, res, undefined, rej);
    });
  }
}
