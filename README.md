# SWM Mock server Android Setup and Standards

## Android Studio Setup


## Artifactory Setup

Artifactory setup is required so that the project dependencies can be downloaded from artifactory.

* Login to https://af.cds.bns using your scotia ID
* Go to your profile page by clicking on your scotia ID on top right corner.
* Enter your password again.
* Generate API key.

#### Note: It changes when you change your Scotia ID password.

* Create gradle.properties file in ``~/.gradle/`` and add this:
````
artifactory_username=YOUR_SCOTIA_ID
artifactory_password=YOUR_API_KEY_GENERATED_IN_STEP2
````

## Generate ssh keys for bitbucket and initialize git submodules

```bash
ssh-keygen -t rsa -b 4096 -C "<your email address>"
```

then following command should copy pub key to clipboard

```bash
pbcopy < ~/.ssh/id_rsa.pub
```

Register your public key here

https://bitbucket.agile.bns/plugins/servlet/ssh/account/keys

## Download git submodules

under root folder

```bash
git submodule update --init --recursive
```

## Build, configuring on device/emulator and run

Now we should be able to build apk and execute on emulator/device.

on Device/Emulator we need to use UAT in Environment in iTrade Config

Then Select `UATRED` in Preferred Environment.

Then pick up a test account from https://itrade-auth-helper.apps.stg.azr-cc-pcf.cloud.bns/table to sign in.

Note: In UAT the security question is always the last word of the question

## Commits and Pull Requests


## Coding Standards

* Kotlin - https://confluence.agile.bns/display/NRL/Android+-+Kotlin+Coding+Standards

## Testing



## Build Variants



## Build Pipelines



## Libraries

## Modular design

**Sub-modules:** Will eventually be pulled from artifactory and serve as libraries across apps (similar to canvas)

- Security
- Webview
- Utils

**Feature modules:** Allow us to isolate code for each feature and any reusable code has to be moved to one of the common modules

- Authentication
- Menu
- Orders
- Portfolio
- Trade

**Common modules:** Contain reusable code that's used across multiple features

- Core
- UI
- Utils

## List item architecture

### Goal

- Have reusable list items for `RecyclerView` (e.g. `AccountListItem` is used on both the Portfolio and Portfolio Accounts pages)
- Easily be able to use different "view types" inside a single `RecyclerView`
- Avoid writing similar boilerplate for `RecyclerView` adapters

### Usage

1. Create a class inside `listitem` package in `ui` module that extends `ListItem`
2. Define an enum for this list item inside `ListItemType` and return this enum as the `type` for the list item class created in step 1
3. Create another class inside `viewholder` package in `ui` module that extends `ListItemViewHolder` and implement `onBind`
   - The `onBind` is equivalent to `RecyclerView.ViewHolder.onBindViewHolder` (i.e. it will fire everytime `RecyclerView` data is changed)
   - The generic variable passed to `ListItemViewHolder` should be the list item class created in step 1
4. Create a "creator" field inside a `companion object` of the list item viewholder created in step 3
   - The "creator" is used to lazily inflate the list item's layout and create the viewholder
5. Create the xml layout for the list item and inflate it in the "creator" created in step 4
6. Pass this "creator" as a parameter to the enum that was created in step 2
7. In the `Fragment`/`Activity` that contains the `RecyclerView`, create a new instance of `CommonAdapter` and set that as the `adapter` on the `RecyclerView`
8. Create `List<ListItem>` and pass this list to `CommonAdapter.updateList`

### Extensions available for list items and their viewholders

`ClickableListItem`

- Extending this class makes the list item "clickable". This allows to set a `clickListener` on the list item and also adds a ripple background to the entire layout.

`RefreshableListItem`

- Implementing this interface allows to define loading state for the list item.
- If adding shimmer loading, can also extend `RefreshableViewHolder` (for the viewholder) that takes a shimmer layout `Group` as parameter and sets the shimmer visible and hides "refreshable content" when loading.

`EditableListItem`

- Impementing this interface allows to define an "editing" state for the list item (e.g. Have checkboxes for each item when in "editing" state).

`CustomDescriptionListItem`

- Implementing this interface allows to define a custom content description for the list item. By default, all the content in the list item is read together.

`CustomAccessibilityFocusListItem`

- Implementing this interface allows to define custom focusability for list item content. By default, the entire list item is focused as one item.

### Other adapters

`RadioButtonAdapter`

- This adapter can be used to dynamically add radio buttons in a `RecyclerView`
- The usage is similar to that of `CommonAdapter` but it only supports `RadioButtonListItem`s

## Custom UI components

`VerticalDividerItemDecoration`

- This class can be used to add dividers between items in a vertically oriented `RecyclerView`
- The dividers can be configured using `VerticalDividerItemDecoration.Builder` properties

`CollapsedCardView`

- This is an extension of `CanvasCardView` that contains a `RecyclerView` with following items
  - `CardHeaderListItem` as the first item (can be "dark" or "light" - see `CardHeaderListItem.HeaderStyle`)
  - `List<ListItem>` as the content
  - (Optional) `CardViewAllListItem` as the last item
- The contents of this component can be configured using `CollapsedCardView.Config`

### Shimmers

To add shimmer/skeleton loading to a UI component, follow these steps

1. In the xml layout, add a `ShimmerFrameLayout` that is constraint to the UI component. The width and height can be set to `skeleton_loading_width` and `skeleton_loading_height`.
2. After the view has been created, do a one time setup on the `ShimmerFrameLayout` (or a `Group` of `ShimmerFrameLayout`s) by calling any of the following: `ShimmerFrameLayout.setup`, `Group.setupShimmerLayouts`, `setupShimmers`.
3. Inside the loading observer call any of the following: `ShimmerFrameLayout.setVisible`, `Group.setShimmerVisible`, `setShimmersVisible`.

NOTE: Sometimes, `Group.setShimmerVisible` does not work as intended. Try using `setShimmersVisible` in that case.

## Features (incomplete)

### Authentication (incomplete)

`BaseSignInViewModel`

- Base class for all `ViewModel`s in authentication
- Contains logic for initialization, error handling and navigation
  - NOTE: Some of the error handling and navigation logic is overridden by child classes (e.g. `MfaViewModel`)

`AuthRepository`

- Singleton "repository" class that encapsulates all network call logic for authentication

`MarvelAuthState`

- Singleton that holds authentication related data such as "challenge key", "auth code", etc.
- Contains logic to "calculate" next challenge based on response from API

`MarvelJwtInteractor`

- Helper class to encode JSON payload to JWT and vice versa

`OAuthState` (part of `core` module)

- Holds information related to user's authentication state
- Saves/retrieves user authentication configuration to/from encrypted shared preferences
- Saves/retrieves remembered cards

## Other helpful stuff to know

### Making a network call

NOTE: Following is a simple example of a network call. There could be differences in the steps depending on the use-case.

1. Create a "service" interface that contains api endpoints as `suspend` functions using `Retrofit` annotations
   - Also need to create an inner `Builder` class that can be used to lazily create an implementation for the endpoints using `Retrofit.create`. See `AccountsService` as an example
2. Create a "repository" class and inject the service created in step 1
3. Add functions to the repository class that return a `Flow<State>` object. See `PortfolioRepository` as an example
4. Inject the repository to the `ViewModel` class
5. Call a function in the repository using the following pattern
   - NOTE: `doPostProcessing` is an optional step

```kotlin
viewModelScope.launch {
	repository.makeNetworkCall()
		.doPostProcessing({ data ->
				// do some post processing here and return data that can be consumed by the view
			})
		.applyCommonHandling(
				doOnError = {
					// do error handling
				}
			)
		.collect { state ->
			when (state) {
				is State.Success -> myLiveData.value = state.data
				is State.Progress -> _loadingLiveData.value = state.isLoading
				is State.Error -> {
					// do error handling
				}
			}
		}
}
```

6. In the `Fragment/Activity`, add an observer to the `LiveData` that is being updated in the `ViewModel` class

```kotlin
viewModel.myLiveData.observe(
	viewLifecycleOwner,
	Observer { viewData ->
		// populate page using view data
	}
)
```

### Pre-fill login credentials

Sometimes it gets annoying to type in the card number/username and password every time. We can use the following steps to pre-fill this information (works on dev builds only).

1. Set `username` and `password` in `Credential.kt`
2. Enable "Pre-fill credentials" from iTrade Config app

NOTE: This may not work if there's a remembered card.
