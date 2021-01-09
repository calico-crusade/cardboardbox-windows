# @cardboard-box/windows
Brings windows-application like layout and design to angular applications!

## Features:
* Resizable & Movable windows
* Task bar for fixing the position and size of windows
* Custom title-bars and body content for windows
* Customizable icons, window layouts and more!

## Usage
Install the library from npm: `npm install @cardboard-box/windows`

Include the module in your AppModule:
```TypeScript
...
import { CardboardBoxWindowsModule } from '@cardboard-box/windows';
...

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CardboardBoxWindowsModule, //<--- This
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Setup your windows in your component
```HTML
<div class="some-container"> <!-- This container tells the box-container how big your desktop space should be-->
    <box-container>
        <box-window>
            <div *title>Hello World</div> <!--This the title of the window-->
            <div *body> <!-- This is the body content of the window -->
                <h1>How are you?</h1>
            </div>
        </box-window>
        <box-window>
            <div *title>Other window!</div>
            <div *body>
                <h1>This is cool!</h1>
            </div>
        </box-window>
    </box-container>
</div>
```

Ensure the container has the correct sizing with a little bit of css!:
```css
.some-container {
    position: fixed; /*Needs to be relative, fixed, or absolute for the styling to work correctly*/
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
}
```

Theme your windows however you want! Here are some default styles (these can go in your styles.scss file!):
```scss
$window-border: rgb(41, 130, 204);

//Everything is contained within this "window-container" class
.window-container {
    background-color: rgb(68, 68, 68);

    //The actual windows are within the "window-background" class
    .window-background {

        //This represents a single resizable and dragable window
        .window-container {
            border: 2px solid #{$window-border};
            background: #fff;
            box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.15);
            
            //This is the title bar for each window
            .window-title {
                background-color: $window-border;
                color: #fff;
                padding-left: 5px;
                padding-bottom: 2px;

                //This represents just the customizable title text
                .title-text {
                    
                }

                //This is the container for the buttons in the title bar
                .title-buttons {
                    //Each of these represents a single button within the title bar
                    button {
                        color: #fff;
                        border: none;
                        outline: none;
                        background-color: unset;
                        font-family: 'Font Awesome 5 Free';

                        //This is how you cange the window-icons (I'm using font-awesome)
                        &.minimize::before {
                            content: '\f2d1'; 
                        }
        
                        &.maximize::before {
                            content: '\f2d0';
                        }

                        &.close::before {
                            content: '\f410'
                        }

                        &.restore::before {
                            content: '\f2d2';
                        }

                        //This can be used to hide the close button
                        /*&.close {
                            display: none;
                        }*/
                    }
                }
            }
        }
    }

    //These are the window titles at the bottom of the page
    .task-bar {
        background-color: rgba(0, 0, 0, 0.75);
        color: #fff;

        //This represents a single windows title
        .window-item {
            background-color: unset;
            color: #fff;
            outline: none;
            border: #ddd;
            margin-left: 10px;

            //This is whether or not the window is active
            &.active {
                border-top: 1px solid #fff;
            }
        }
    }
}
```

Run your application and see the magic!