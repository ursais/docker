<script>
  export let component;
  export let props;
</script>

<svelte:options accessors={true} />
<svelte:component this={component} {...props}/>