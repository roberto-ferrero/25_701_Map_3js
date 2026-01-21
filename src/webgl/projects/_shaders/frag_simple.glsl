

uniform sampler2D u_in_texture;

varying vec2 vUv;

void main(){
    vec2 uv = vUv;
    vec4 finalColor = texture2D(u_in_texture, uv);
    //finalColor*= 1.5;
	// gl_FragColor = vec4(finalColor.xyz, 1.0);
	gl_FragColor = finalColor;
    

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
