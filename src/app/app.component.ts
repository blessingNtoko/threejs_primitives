import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { Geometry, Object3D } from 'three';

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
    this.scene.add(this.light);

    this.addSolidGeometry(-2, 2, new THREE.BoxBufferGeometry(8, 8, 8));
    this.addSolidGeometry(-1, 2, new THREE.CircleBufferGeometry(7, 24));
    this.addSolidGeometry(0, 2, new THREE.ConeBufferGeometry(6, 8, 16));
    this.addSolidGeometry(1, 2, new THREE.CylinderBufferGeometry(4, 4, 8, 12));
    this.addSolidGeometry(2, 2, new THREE.DodecahedronBufferGeometry(7));
    this.addSolidGeometry(-1, 1, new THREE.IcosahedronBufferGeometry(7));

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);

    const animate = () => {
      this.objects.forEach(obj => {
          obj.rotation.x += .01;
      });

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
}
