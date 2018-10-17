import { NgModule } from '@angular/core';
import { MapToIterablePipe } from './map-to-iterable/map-to-iterable';
@NgModule({
	declarations: [MapToIterablePipe],
	imports: [],
	exports: [MapToIterablePipe]
})
export class PipesModule {
	static forRoot() {
      return {
          ngModule: PipesModule,
          providers: [],
      };
   }
}
