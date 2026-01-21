
uniform  vec2 uMousePosition;
uniform  vec2 uSize;
uniform  float uFadeInProgress;

varying vec2 vUv;


vec3 lensflares(vec2 uv, vec2 pos, out vec3 sunflare, out vec3 lensflare)
{
	vec2 main = uv-pos;
	vec2 uvd = uv*(length(uv));

	float ang = atan(main.y, main.x);
	float dist = length(main);
    dist = pow(dist, 0.1);

	float f0 = 1.0/(length(uv-pos)*25.0+1.0);
	f0 = pow(f0, 2.0);

	f0 = f0+f0*(sin((ang+1.0/18.0)*12.0)*.1+dist*.1+.8);

	float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.25;
	float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.23;
	float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.21;

	vec2 uvx = mix(uv,uvd,-0.5);

	float f4 = max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;
	float f42 = max(0.01-pow(length(uvx+0.45*pos),2.4),.0)*5.0;
	float f43 = max(0.01-pow(length(uvx+0.5*pos),2.4),.0)*3.0;

	uvx = mix(uv,uvd,-.4);

	float f5 = max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;
	float f52 = max(0.01-pow(length(uvx+0.4*pos),5.5),.0)*2.0;
	float f53 = max(0.01-pow(length(uvx+0.6*pos),5.5),.0)*2.0;

	uvx = mix(uv,uvd,-0.5);

	float f6 = max(0.01-pow(length(uvx-0.3*pos),1.6),.0)*6.0;
	float f62 = max(0.01-pow(length(uvx-0.325*pos),1.6),.0)*3.0;
	float f63 = max(0.01-pow(length(uvx-0.35*pos),1.6),.0)*5.0;

    sunflare = vec3(f2); //vec3(f0);
    lensflare = vec3(f2+f4+f5+f6, f22+f42+f52+f62, f23+f43+f53+f63);

	return sunflare+lensflare;
}

vec3 rgb2hsl(vec3 c ){
  float h = 0.0;
	float s = 0.0;
	float l = 0.0;
	float r = c.r;
	float g = c.g;
	float b = c.b;
	float cMin = min( r, min( g, b ) );
	float cMax = max( r, max( g, b ) );

	l = ( cMax + cMin ) / 2.0;
	if ( cMax > cMin ) {
		float cDelta = cMax - cMin;
        
        //s = l < .05 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) ); Original
		s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );
        
		if ( r == cMax ) {
			h = ( g - b ) / cDelta;
		} else if ( g == cMax ) {
			h = 2.0 + ( b - r ) / cDelta;
		} else {
			h = 4.0 + ( r - g ) / cDelta;
		}

		if ( h < 0.0) {
			h += 6.0;
		}
		h = h / 6.0;
	}
	return vec3( h, s, l );
}

void main()	{   
    
    float aspectRatio = uSize.x/uSize.y;

    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    float finalAlpha = 1.0;


    vec2 uv = vUv-0.5;
    uv.y /= aspectRatio;
    uv *= 1.0;
    vec2 mouse_position = uMousePosition;

    float dist = distance(mouse_position*1.0, vec2(0.0, 0.0));
    finalAlpha *= dist*10.0;
    
    vec3 suncolor = vec3(0.7608, 0.6863, 0.3647);
    vec3 sun, sunflare, lensflare;
    vec3 flare = lensflares(uv*2.5, mouse_position*2.5, sunflare, lensflare);
    

    sun += (flare*1.4)*suncolor*1.0;
    finalColor += sun;
    //vec3 hls = vec3(1.0, 1.0, 1.0);
    //hls = rgb2hsl(finalColor)*10.0;
    
    
    //finalColor = 1.0 - exp(-1.0 * col);
	finalColor = pow(finalColor, vec3(1.0/1.3));

    finalColor = mix(black, finalColor, uFadeInProgress);
    // finalAlpha = mix(1.0, finalAlpha, uFadeInProgress);
    finalAlpha = 2.0;

    gl_FragColor = vec4(finalColor, finalAlpha);

}